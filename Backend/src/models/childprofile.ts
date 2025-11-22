// src/models/ChildProfile.ts
import { BaseModel } from './BaseModels';

// === CRITICAL: Initialize DB connection ===
BaseModel.init();

export interface ChildProfile {
  child_id: string;
  family_id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  photo_url?: string | null;
  needs?: string | null; // JSON string
  orphan_status?: 'full_orphan' | 'father_orphan' | 'mother_orphan' | 'none';
  created_at: string;
  updated_at: string;
}

export class ChildProfileModel extends BaseModel {
  // === SAFE PREPARED STATEMENTS ===
  private static get insertStmt() {
    return this.db.prepare(`
      INSERT INTO child_profiles 
      (child_id, family_id, name, age, gender, photo_url, needs, orphan_status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
  }

  private static get getByIdStmt() {
    return this.db.prepare('SELECT * FROM child_profiles WHERE child_id = ?');
  }

  private static get getByFamilyIdStmt() {
    return this.db.prepare('SELECT * FROM child_profiles WHERE family_id = ? ORDER BY created_at DESC');
  }

  private static get updatePhotoStmt() {
    return this.db.prepare('UPDATE child_profiles SET photo_url = ?, updated_at = datetime("now") WHERE child_id = ?');
  }

  private static get deleteStmt() {
    return this.db.prepare('DELETE FROM child_profiles WHERE child_id = ?');
  }

  // === CREATE CHILD ===
  static create(data: {
    family_id: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    needs?: object;
    orphan_status?: 'full_orphan' | 'father_orphan' | 'mother_orphan' | 'none';
  }): ChildProfile {
    if (data.age < 0 || data.age > 18) {
      throw new Error('Child age must be between 0 and 18');
    }

    const child_id = `CHD${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-12);
    const needsJson = data.needs ? JSON.stringify(data.needs) : null;

    this.insertStmt.run(
      child_id,
      data.family_id,
      data.name,
      data.age,
      data.gender,
      null, // photo_url
      needsJson,
      data.orphan_status || 'none'
    );

    return this.getById(child_id)!;
  }

  // === GET ONE ===
  static getById(child_id: string): ChildProfile | undefined {
    return this.getByIdStmt.get(child_id) as ChildProfile | undefined;
  }

  // === GET ALL BY FAMILY ===
  static getByFamilyId(family_id: string): ChildProfile[] {
    return this.getByFamilyIdStmt.all(family_id) as ChildProfile[];
  }

  // === UPDATE PHOTO ===
  static updatePhoto(child_id: string, photo_url: string): void {
    const result = this.updatePhotoStmt.run(photo_url, child_id);
    if (result.changes === 0) throw new Error('Child not found');
  }

  // === DELETE CHILD ===
  static delete(child_id: string): void {
    const result = this.deleteStmt.run(child_id);
    if (result.changes === 0) throw new Error('Child not found');
  }
}