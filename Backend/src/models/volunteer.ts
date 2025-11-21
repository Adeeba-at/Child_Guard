// src/models/volunteer.ts
import { BaseModel } from "./BaseModels";

export interface Volunteer {
    volunteer_id: string; // same as user_id
    phone: string | null;
    availability: string | null; // JSON string
    area: string | null;
    status: "pending" | "requested" | "approved" | "rejected";
}

export class VolunteerModel extends BaseModel {
    // Initialize DB if needed
    static initDB() {
        if (!this.db) this.init();
    }

    // Get volunteer by volunteer_id (same as user_id)
    static async getById(volunteerId: string): Promise<Volunteer | null> {
        this.initDB();
        const row = this.db
            .prepare(
                "SELECT volunteer_id, phone, availability, area, status FROM volunteers WHERE volunteer_id = ?"
            )
            .get(volunteerId) as Volunteer | undefined;

        return row ?? null;
    }

    // Alias for getById (volunteer_id = user_id)
    static async getByUserId(userId: string): Promise<Volunteer | null> {
        return this.getById(userId);
    }

    // Create a new volunteer
    static async create(volunteerId: string): Promise<Volunteer> {
        this.initDB();
        this.db
            .prepare(
                `INSERT INTO volunteers (volunteer_id, phone, availability, area, status)
                 VALUES (?, NULL, NULL, NULL, 'pending')`
            )
            .run(volunteerId);

        return this.getById(volunteerId) as Promise<Volunteer>;
    }

    // Update availability
    static async updateAvailability(
        volunteerId: string,
        availability: { days: string[]; time: string }
    ): Promise<Volunteer | null> {
        this.initDB();

        const result = this.db
            .prepare(`
                UPDATE volunteers 
                SET availability = ? 
                WHERE volunteer_id = ?
            `)
            .run(JSON.stringify(availability), volunteerId);

        if (result.changes === 0) return null;

        return this.getById(volunteerId);
    }

    // Request approval: update phone, area, availability, and status
    static async requestApproval(
        volunteerId: string,
        data: {
            phone: string;
            area: string;
            availability: { days: string[]; time: string };
        }
    ): Promise<Volunteer | null> {
        this.initDB();

        const result = this.db
            .prepare(`
                UPDATE volunteers
                SET 
                    phone = ?, 
                    area = ?, 
                    availability = ?, 
                    status = 'requested'
                WHERE volunteer_id = ?
            `)
            .run(
                data.phone,
                data.area,
                JSON.stringify(data.availability),
                volunteerId
            );

        if (result.changes === 0) return null;

        return this.getById(volunteerId);
    }
}
