import { BaseModel } from "./BaseModels";

export interface Sponsor {
    sponsor_id: string;
    phone: string | null;
    preferences: string | null;
}

export interface ChildApplication {
    application_id: string;
    child_id: string;
    name: string;
    age: number;
    gender: string;
    address: string;  // Changed from location to address
    status: string;
    sponsor_id: string | null;
}

export class SponsorModel extends BaseModel {

    static initDB() {
        if (!this.db) this.init();
    }

    // ----------------------
    // GET SPONSOR BY ID
    // ----------------------
    static async getById(sponsorId: string): Promise<Sponsor | null> {
        this.initDB();

        const row = this.db
            .prepare(`SELECT sponsor_id, phone, preferences FROM sponsors WHERE sponsor_id = ?`)
            .get(sponsorId) as Sponsor | undefined;

        return row ?? null;
    }

    // ----------------------
    // CREATE SPONSOR
    // ----------------------
    static async create(sponsorId: string): Promise<Sponsor> {
        this.initDB();

        this.db.prepare(
            `INSERT INTO sponsors (sponsor_id, phone, preferences) VALUES (?, NULL, NULL)`
        ).run(sponsorId);

        return this.getById(sponsorId) as Promise<Sponsor>;
    }

    // ----------------------
    // UPDATE SPONSOR INFO
    // ----------------------
    static async updateInfo(
        sponsorId: string,
        data: {
            phone?: string;
            preferences?: { ageRange: string; location: string };
        }
    ): Promise<Sponsor | null> {
        this.initDB();

        const result = this.db.prepare(`
            UPDATE sponsors
            SET phone = COALESCE(?, phone),
                preferences = COALESCE(?, preferences)
            WHERE sponsor_id = ?
        `).run(
            data.phone || null,
            data.preferences ? JSON.stringify(data.preferences) : null,
            sponsorId
        );

        if (result.changes === 0) return null;

        return this.getById(sponsorId);
    }

    // ----------------------
    // GET ALL ELIGIBLE CHILDREN ACCORDING TO SPONSOR PREFERENCES
    // ----------------------
    static async getMatchingChildren(sponsorId: string): Promise<ChildApplication[]> {
        this.initDB();

        try {
            const sponsor = await this.getById(sponsorId);
            
            if (!sponsor) {
                console.log(`Sponsor ${sponsorId} not found`);
                return [];
            }

            if (!sponsor.preferences) {
                console.log(`Sponsor ${sponsorId} has no preferences set`);
                return [];
            }

            const prefs = JSON.parse(sponsor.preferences);

            if (!prefs.ageRange || !prefs.location) {
                console.log(`Invalid preferences for sponsor ${sponsorId}:`, prefs);
                return [];
            }

            const [minAge, maxAge] = prefs.ageRange.split('-').map(Number);

            if (isNaN(minAge) || isNaN(maxAge)) {
                console.log(`Invalid age range format: ${prefs.ageRange}`);
                return [];
            }

            // Using 'address' instead of 'location' from families table
            const rows = this.db.prepare(`
                SELECT 
                    a.application_id, 
                    c.child_id, 
                    c.name,
                    c.age, 
                    c.gender,
                    f.address,
                    a.status, 
                    a.sponsor_id
                FROM applications a
                JOIN child_profiles c ON a.child_id = c.child_id
                JOIN families f ON c.family_id = f.family_id
                WHERE a.status = 'pending'
                  AND c.age BETWEEN ? AND ?
                  AND f.address LIKE ?
            `).all(
                minAge,
                maxAge,
                `%${prefs.location}%`
            ) as ChildApplication[];

            console.log(`Found ${rows.length} matching children for sponsor ${sponsorId}`);
            return rows;
        } catch (err) {
            console.error(`Error in getMatchingChildren for ${sponsorId}:`, err);
            throw err;
        }
    }

    // ----------------------
    // SPONSOR SELECTS A CHILD
    // ----------------------
    static async sponsorChild(
        sponsorId: string,
        applicationId: string
    ): Promise<ChildApplication | null> {
        this.initDB();

        const result = this.db.prepare(`
            UPDATE applications
            SET sponsor_id = ?, status = 'sponsored'
            WHERE application_id = ? AND status = 'pending'
        `).run(sponsorId, applicationId);

        if (result.changes === 0) return null;

        const app = this.db.prepare(`
            SELECT 
                a.application_id, 
                c.child_id, 
                c.name,
                c.age, 
                c.gender,
                f.address,
                a.status, 
                a.sponsor_id
            FROM applications a
            JOIN child_profiles c ON a.child_id = c.child_id
            JOIN families f ON c.family_id = f.family_id
            WHERE a.application_id = ?
        `).get(applicationId) as ChildApplication | undefined;

        return app ?? null;
    }

    // ----------------------
    // GET ALL CHILDREN SPONSORED BY THIS SPONSOR
    // ----------------------
    static async mySponsoredChildren(sponsorId: string): Promise<ChildApplication[]> {
        this.initDB();

        try {
            const rows = this.db.prepare(`
                SELECT 
                    a.application_id, 
                    c.child_id, 
                    c.name,
                    c.age, 
                    c.gender,
                    f.address,
                    a.status, 
                    a.sponsor_id
                FROM applications a
                JOIN child_profiles c ON a.child_id = c.child_id
                JOIN families f ON c.family_id = f.family_id
                WHERE a.sponsor_id = ?
            `).all(sponsorId);

            console.log(`Found ${rows.length} sponsored children for sponsor ${sponsorId}`);
            return rows as ChildApplication[];
        } catch (err) {
            console.error("DB query failed:", err);
            throw err;
        }
    }
}