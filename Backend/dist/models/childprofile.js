"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildProfileModel = void 0;
// src/models/ChildProfile.ts
const BaseModels_1 = require("./BaseModels");
// === CRITICAL: Initialize DB connection ===
BaseModels_1.BaseModel.init();
class ChildProfileModel extends BaseModels_1.BaseModel {
    // === SAFE PREPARED STATEMENTS ===
    static get insertStmt() {
        return this.db.prepare(`
      INSERT INTO child_profiles 
      (child_id, family_id, name, age, gender, photo_url, needs, orphan_status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
    }
    static get getByIdStmt() {
        return this.db.prepare('SELECT * FROM child_profiles WHERE child_id = ?');
    }
    static get getByFamilyIdStmt() {
        return this.db.prepare('SELECT * FROM child_profiles WHERE family_id = ? ORDER BY created_at DESC');
    }
    static get updatePhotoStmt() {
        return this.db.prepare('UPDATE child_profiles SET photo_url = ?, updated_at = datetime("now") WHERE child_id = ?');
    }
    static get deleteStmt() {
        return this.db.prepare('DELETE FROM child_profiles WHERE child_id = ?');
    }
    // === CREATE CHILD ===
    static create(data) {
        if (data.age < 0 || data.age > 18) {
            throw new Error('Child age must be between 0 and 18');
        }
        const child_id = `CHD${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-12);
        const needsJson = data.needs ? JSON.stringify(data.needs) : null;
        this.insertStmt.run(child_id, data.family_id, data.name, data.age, data.gender, null, // photo_url
        needsJson, data.orphan_status || 'none');
        return this.getById(child_id);
    }
    // === GET ONE ===
    static getById(child_id) {
        return this.getByIdStmt.get(child_id);
    }
    // === GET ALL BY FAMILY ===
    static getByFamilyId(family_id) {
        return this.getByFamilyIdStmt.all(family_id);
    }
    // === UPDATE PHOTO ===
    static updatePhoto(child_id, photo_url) {
        const result = this.updatePhotoStmt.run(photo_url, child_id);
        if (result.changes === 0)
            throw new Error('Child not found');
    }
    // === DELETE CHILD ===
    static delete(child_id) {
        const result = this.deleteStmt.run(child_id);
        if (result.changes === 0)
            throw new Error('Child not found');
    }
}
exports.ChildProfileModel = ChildProfileModel;
