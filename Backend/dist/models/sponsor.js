"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SponsorModel = void 0;
const DatabaseConnection_1 = require("../config/database/DatabaseConnection");
const db = DatabaseConnection_1.DatabaseConnection.getInstance();
class SponsorModel {
    static async findById(id) {
        const row = db
            .prepare("SELECT * FROM sponsors WHERE sponsor_id = ?")
            .get(id);
        return row || null;
    }
    static async findByUserId(user_id) {
        return db
            .prepare("SELECT * FROM sponsors WHERE sponsor_id = ?")
            .get(user_id);
    }
    static async update(id, updates) {
        const fields = Object.keys(updates)
            .map((key) => `${key} = @${key}`)
            .join(", ");
        db.prepare(`UPDATE sponsors SET ${fields} WHERE sponsor_id = @id`).run({
            ...updates,
            id,
        });
        return (await this.findById(id));
    }
    static async getAllSponsors() {
        return db.prepare("SELECT * FROM sponsors").all();
    }
    // Get children sponsored by this sponsor
    static async getSponsoredChildren(sponsor_id) {
        return db
            .prepare(`
      SELECT 
        cp.child_id, 
        cp.name, 
        cp.age, 
        cp.gender, 
        cp.grade, 
        cp.school AS school_name, 
        cp.photo_url AS photo, 
        cp.story, 
        cp.city,
        sc.sponsored_date
      FROM child_profiles cp
      JOIN sponsor_children sc ON sc.child_id = cp.child_id
      WHERE sc.sponsor_id = ?
      ORDER BY sc.sponsored_date DESC
    `)
            .all(sponsor_id);
    }
    // NEW: Get applications for this sponsor
    static async getApplications(sponsor_id) {
        return db
            .prepare(`
      SELECT 
        a.application_id,
        a.sponsor_id,
        a.child_id,
        cp.name as child_name,
        a.status,
        a.created_at,
        a.updated_at
      FROM applications a
      LEFT JOIN child_profiles cp ON a.child_id = cp.child_id
      WHERE a.sponsor_id = ?
      ORDER BY a.created_at DESC
    `)
            .all(sponsor_id);
    }
    // NEW: Get reports for children sponsored by this sponsor
    static async getReports(sponsor_id) {
        return db
            .prepare(`
      SELECT 
        r.report_id,
        r.child_id,
        cp.name as child_name,
        r.title,
        r.content,
        r.report_type,
        r.created_at
      FROM reports r
      JOIN child_profiles cp ON r.child_id = cp.child_id
      JOIN sponsor_children sc ON sc.child_id = cp.child_id
      WHERE sc.sponsor_id = ?
      ORDER BY r.created_at DESC
    `)
            .all(sponsor_id);
    }
}
exports.SponsorModel = SponsorModel;
