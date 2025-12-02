"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sponsorController = void 0;
const sponsor_1 = require("../models/sponsor");
exports.sponsorController = {
    // Admin: Get all sponsors
    getAll: async (_req, res) => {
        try {
            const sponsors = await sponsor_1.SponsorModel.getAllSponsors();
            res.json({ data: sponsors });
        }
        catch (err) {
            console.error("Fetch sponsors error:", err);
            res.status(500).json({ message: "Failed to load sponsors" });
        }
    },
    // Admin: Approve sponsor
    approve: async (req, res) => {
        const { sponsor_id } = req.params;
        try {
            await sponsor_1.SponsorModel.update(sponsor_id, { status: "approved" });
            res.json({ message: "Sponsor approved" });
        }
        catch (err) {
            console.error("Approve sponsor error:", err);
            res.status(500).json({ message: "Failed to approve sponsor" });
        }
    },
    // Admin: Reject sponsor
    reject: async (req, res) => {
        const { sponsor_id } = req.params;
        try {
            await sponsor_1.SponsorModel.update(sponsor_id, { status: "rejected" });
            res.json({ message: "Sponsor rejected" });
        }
        catch (err) {
            console.error("Reject sponsor error:", err);
            res.status(500).json({ message: "Failed to reject sponsor" });
        }
    },
    // Sponsor: Get profile (legacy route)
    me: async (req, res) => {
        if (!req.user || req.user.role !== "sponsor") {
            return res.status(401).json({ message: "Unauthorized" });
        }
        try {
            const sponsor = await sponsor_1.SponsorModel.findById(req.user.user_id);
            if (!sponsor) {
                return res.status(404).json({ message: "Sponsor not found" });
            }
            res.json({
                sponsor_id: sponsor.sponsor_id,
                name: sponsor.name,
                email: sponsor.email,
                phone: sponsor.phone || "",
                occupation: sponsor.occupation || "",
                preferences: sponsor.preferences || "",
                status: sponsor.status || "",
            });
        }
        catch (err) {
            console.error("Fetch sponsor profile error:", err);
            res.status(500).json({ message: "Failed to load sponsor data." });
        }
    },
    // NEW: Get sponsored children by sponsor ID
    getSponsoredChildren: async (req, res) => {
        try {
            const { sponsorId } = req.params;
            const children = await sponsor_1.SponsorModel.getSponsoredChildren(sponsorId);
            res.json({ success: true, data: children });
        }
        catch (err) {
            console.error("Get sponsored children error:", err);
            res.status(500).json({
                success: false,
                message: "Failed to load sponsored children"
            });
        }
    },
    // NEW: Get applications for a sponsor
    getApplications: async (req, res) => {
        try {
            const { sponsorId } = req.params;
            const applications = await sponsor_1.SponsorModel.getApplications(sponsorId);
            res.json({ success: true, data: applications });
        }
        catch (err) {
            console.error("Get applications error:", err);
            res.status(500).json({
                success: false,
                message: "Failed to load applications"
            });
        }
    },
    // NEW: Get reports for a sponsor
    getReports: async (req, res) => {
        try {
            const { sponsorId } = req.params;
            const reports = await sponsor_1.SponsorModel.getReports(sponsorId);
            res.json({ success: true, data: reports });
        }
        catch (err) {
            console.error("Get reports error:", err);
            res.status(500).json({
                success: false,
                message: "Failed to load reports"
            });
        }
    },
};
