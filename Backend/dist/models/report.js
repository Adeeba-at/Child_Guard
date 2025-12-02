"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModel = void 0;
// src/models/report.ts
const BaseModels_1 = require("./BaseModels");
class ReportModel extends BaseModels_1.BaseModel {
    static submit(data) {
        this.init();
        const reportId = `RPT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const insert = this.db.prepare(`
      INSERT INTO reports (report_id, reporter_id, location, description, child_name, child_age, photo_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
        insert.run(reportId, data.reporter_id || null, data.location, data.description, data.child_name || null, data.child_age || null, data.photo_url || null);
        const report = this.db
            .prepare("SELECT * FROM reports WHERE report_id = ?")
            .get(reportId);
        return report;
    }
    static findById(report_id) {
        this.init();
        return this.db
            .prepare("SELECT * FROM reports WHERE report_id = ?")
            .get(report_id);
    }
}
exports.ReportModel = ReportModel;
