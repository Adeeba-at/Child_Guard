"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/sponsorRoutes.ts
const express_1 = require("express");
const sponsorControllers_1 = require("../controllers/sponsorControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const DatabaseConnection_1 = require("../config/database/DatabaseConnection");
const router = (0, express_1.Router)();
const db = DatabaseConnection_1.DatabaseConnection.getInstance();
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚠️  ROUTE ORDER IS CRITICAL! 
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPECIFIC string routes MUST come BEFORE dynamic :parameter routes
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Available children route - MUST be before /:sponsorId/children
router.get("/children/available", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        console.log('🔍 Route hit: /api/sponsor/children/available');
        const queries = [
            // Query 1: child_profiles with sponsor_children join
            `SELECT 
        cp.child_id, 
        cp.name, 
        cp.age, 
        cp.gender, 
        cp.photo_url as photo, 
        cp.city as location, 
        cp.story,
        cp.grade,
        cp.school as school_name
      FROM child_profiles cp
      WHERE cp.child_id NOT IN (
        SELECT child_id FROM sponsor_children
      )
      ORDER BY cp.created_at DESC`,
            // Query 2: children table with sponsor_id IS NULL
            `SELECT 
        child_id, 
        name, 
        age, 
        gender, 
        photo_url as photo, 
        city as location, 
        story,
        grade,
        school as school_name
      FROM children 
      WHERE sponsor_id IS NULL
      ORDER BY created_at DESC`,
            // Query 3: Simple children table
            `SELECT 
        child_id, 
        name, 
        age, 
        gender, 
        photo_url as photo, 
        city as location, 
        story,
        grade,
        school as school_name
      FROM children 
      WHERE sponsor_id IS NULL OR sponsor_id = ''
      ORDER BY created_at DESC`
        ];
        let children = null;
        for (let i = 0; i < queries.length; i++) {
            try {
                children = db.prepare(queries[i]).all();
                console.log(`✅ Available children fetched using Query ${i + 1}, found ${children.length} children`);
                break;
            }
            catch (queryError) {
                console.log(`⚠️  Query ${i + 1} failed, trying next...`);
                continue;
            }
        }
        if (children === null) {
            console.error('❌ No matching table structure found for available children');
            return res.status(500).json({
                success: false,
                message: "Database schema not recognized. Please check table structure."
            });
        }
        res.json({ success: true, data: children });
    }
    catch (err) {
        console.error("Get available children error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to load available children"
        });
    }
});
// Legacy route for current user profile
router.get("/me", authMiddleware_1.authMiddleware, sponsorControllers_1.sponsorController.me);
// Admin routes
router.get("/sponsors", authMiddleware_1.authMiddleware, sponsorControllers_1.sponsorController.getAll);
router.patch("/sponsors/:sponsor_id/approve", authMiddleware_1.authMiddleware, sponsorControllers_1.sponsorController.approve);
router.patch("/sponsors/:sponsor_id/reject", authMiddleware_1.authMiddleware, sponsorControllers_1.sponsorController.reject);
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DYNAMIC ROUTES - Must come AFTER all specific routes
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Sponsor dashboard routes
router.get("/:sponsorId/children", authMiddleware_1.authMiddleware, sponsorControllers_1.sponsorController.getSponsoredChildren);
router.get("/:sponsorId/applications", authMiddleware_1.authMiddleware, sponsorControllers_1.sponsorController.getApplications);
router.get("/:sponsorId/reports", authMiddleware_1.authMiddleware, sponsorControllers_1.sponsorController.getReports);
exports.default = router;
