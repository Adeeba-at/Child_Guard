"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = void 0;
const BaseModels_1 = require("./BaseModels");
const volunteer_1 = require("./volunteer");
class AdminModel extends BaseModels_1.BaseModel {
    static initDB() {
        if (!this.db)
            this.init();
    }
    // Volunteer Management Functions
    static async getAllVolunteers() {
        this.initDB();
        const rows = this.db
            .prepare("SELECT volunteer_id, phone, availability, area, age, status FROM volunteers")
            .all();
        return rows;
    }
    static async getRequestedVolunteers() {
        this.initDB();
        const rows = this.db
            .prepare("SELECT volunteer_id, phone, availability, area, age, status FROM volunteers WHERE status = 'requested'")
            .all();
        return rows;
    }
    static async approveVolunteer(volunteerId) {
        this.initDB();
        const volunteer = await volunteer_1.VolunteerModel.getById(volunteerId);
        if (!volunteer)
            return null;
        if (volunteer.age !== null && volunteer.age < 18) {
            // Automatically reject if age < 18
            return this.rejectVolunteer(volunteerId);
        }
        const result = this.db
            .prepare("UPDATE volunteers SET status = 'approved' WHERE volunteer_id = ?")
            .run(volunteerId);
        if (result.changes === 0)
            return null;
        return volunteer_1.VolunteerModel.getById(volunteerId);
    }
    static async rejectVolunteer(volunteerId) {
        this.initDB();
        const result = this.db
            .prepare("UPDATE volunteers SET status = 'rejected' WHERE volunteer_id = ?")
            .run(volunteerId);
        if (result.changes === 0)
            return null;
        return volunteer_1.VolunteerModel.getById(volunteerId);
    }
}
exports.AdminModel = AdminModel;
