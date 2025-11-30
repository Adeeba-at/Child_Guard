// src/controllers/sponsorController.ts
import { Request, Response } from "express";
import { SponsorModel } from "../models/sponsor";
import { AuthRequest } from "../middleware/authMiddleware";

interface Child {
  child_id: string;
  name: string;
  age: number;
  grade?: string;
  gender?: string;
  school_name?: string;
  city?: string;
  story?: string;
  photo?: string;
}

export const sponsorController = {
  // Admin: Get all sponsors
  getAll: async (_req: Request, res: Response) => {
    try {
      const sponsors = await SponsorModel.getAllSponsors();
      res.json({ data: sponsors });
    } catch (err) {
      console.error("Fetch sponsors error:", err);
      res.status(500).json({ message: "Failed to load sponsors" });
    }
  },

  // Admin: Approve sponsor
  approve: async (req: Request, res: Response) => {
    const { sponsor_id } = req.params;
    try {
      await SponsorModel.update(sponsor_id, { status: "approved" });
      res.json({ message: "Sponsor approved" });
    } catch (err) {
      console.error("Approve sponsor error:", err);
      res.status(500).json({ message: "Failed to approve sponsor" });
    }
  },

  // Admin: Reject sponsor
  reject: async (req: Request, res: Response) => {
    const { sponsor_id } = req.params;
    try {
      await SponsorModel.update(sponsor_id, { status: "rejected" });
      res.json({ message: "Sponsor rejected" });
    } catch (err) {
      console.error("Reject sponsor error:", err);
      res.status(500).json({ message: "Failed to reject sponsor" });
    }
  },

  // Sponsor: Get profile
  me: async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== "sponsor")
      return res.status(401).json({ message: "Unauthorized" });

    try {
      const sponsor = await SponsorModel.findById(req.user.user_id);
      if (!sponsor) return res.status(404).json({ message: "Sponsor not found" });

      res.json({
        sponsor_id: sponsor.sponsor_id,
        name: sponsor.name,
        email: sponsor.email,
        phone: sponsor.phone || "",
        occupation: sponsor.occupation || "",
        preferences: sponsor.preferences || "",
        status: sponsor.status || "",
      });
    } catch (err) {
      console.error("Fetch sponsor profile error:", err);
      res.status(500).json({ message: "Failed to load sponsor data." });
    }
  },

  // Sponsor: Get sponsored children
  children: async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== "sponsor")
      return res.status(401).json({ message: "Unauthorized" });

    try {
      const sponsor = await SponsorModel.findByUserId(req.user.user_id);
      if (!sponsor) return res.status(404).json({ message: "Sponsor not found" });

      const children = await SponsorModel.getSponsoredChildren(sponsor.sponsor_id);
      res.json(children);
    } catch (err) {
      console.error("Fetch sponsored children error:", err);
      res.status(500).json({ message: "Failed to load children" });
    }
  },
};
