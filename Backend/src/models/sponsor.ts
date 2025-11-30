// src/models/sponsor.ts
import bcrypt from "bcryptjs";
import { DatabaseConnection } from "../config/database/DatabaseConnection";

const db = DatabaseConnection.getInstance();

export interface Sponsor {
  sponsor_id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  occupation?: string;
  preferences?: string;
  organization?: string;
  type?: string;
  status: string;
}

export class SponsorModel {
  static async findById(id: string): Promise<Sponsor | null> {
    const row = db.prepare("SELECT * FROM sponsors WHERE sponsor_id = ?").get(id);
    return (row as Sponsor) || null;
  }

  static async findByUserId(user_id: string): Promise<Sponsor | undefined> {
    return db.prepare("SELECT * FROM sponsors WHERE sponsor_id = ?").get(user_id) as Sponsor | undefined;
  }

  static async update(
    id: string,
    updates: Partial<Omit<Sponsor, "sponsor_id" | "email" | "password">>
  ): Promise<Sponsor> {
    const fields = Object.keys(updates).map((key) => `${key} = @${key}`).join(", ");
    db.prepare(`UPDATE sponsors SET ${fields} WHERE sponsor_id = @id`).run({ ...updates, id });
    return (await this.findById(id)) as Sponsor;
  }

  static async getSponsoredChildren(sponsor_id: string) {
    return db.prepare(`
      SELECT cp.child_id, cp.name, cp.age, cp.gender, cp.grade,
             cp.school AS school_name, cp.photo_url AS photo, cp.story, cp.city
      FROM child_profiles cp
      JOIN sponsor_children sc ON sc.child_id = cp.child_id
      WHERE sc.sponsor_id = ?
    `).all(sponsor_id);
  }

  static async getAllSponsors(): Promise<Sponsor[]> {
    return db.prepare("SELECT * FROM sponsors").all() as Sponsor[];
  }
}
