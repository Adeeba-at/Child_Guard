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

export interface Application {
  application_id: string;
  sponsor_id: string;
  child_id: string;
  child_name?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface Report {
  report_id: string;
  child_id: string;
  child_name?: string;
  title: string;
  content: string;
  report_type?: string;
  created_at: string;
}

export class SponsorModel {
  static async findById(id: string): Promise<Sponsor | null> {
    const row = db
      .prepare("SELECT * FROM sponsors WHERE sponsor_id = ?")
      .get(id);
    return (row as Sponsor) || null;
  }

  static async findByUserId(user_id: string): Promise<Sponsor | undefined> {
    return db
      .prepare("SELECT * FROM sponsors WHERE sponsor_id = ?")
      .get(user_id) as Sponsor | undefined;
  }

  static async update(
    id: string,
    updates: Partial<Omit<Sponsor, "sponsor_id">>
  ): Promise<Sponsor> {
    const fields = Object.keys(updates)
      .map((key) => `${key} = @${key}`)
      .join(", ");
    
    db.prepare(`UPDATE sponsors SET ${fields} WHERE sponsor_id = @id`).run({
      ...updates,
      id,
    });
    
    return (await this.findById(id)) as Sponsor;
  }

  static async getAllSponsors(): Promise<Sponsor[]> {
    return db.prepare("SELECT * FROM sponsors").all() as Sponsor[];
  }

  // Get children sponsored by this sponsor
  static async getSponsoredChildren(sponsor_id: string) {
    return db
      .prepare(
        `
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
    `
      )
      .all(sponsor_id);
  }

  // NEW: Get applications for this sponsor
  static async getApplications(sponsor_id: string): Promise<Application[]> {
    return db
      .prepare(
        `
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
    `
      )
      .all(sponsor_id) as Application[];
  }

  // NEW: Get reports for children sponsored by this sponsor
  static async getReports(sponsor_id: string): Promise<Report[]> {
    return db
      .prepare(
        `
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
    `
      )
      .all(sponsor_id) as Report[];
  }
}