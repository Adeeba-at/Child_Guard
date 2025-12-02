"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/visitsRoutes.ts
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const BaseModels_1 = require("../models/BaseModels");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.get("/volunteer/:volunteerId", async (req, res) => {
    try {
        BaseModels_1.BaseModel.init();
        const volunteerId = req.params.volunteerId;
        const visits = BaseModels_1.BaseModel.db
            .prepare(`
                SELECT * 
                FROM verification_visits 
                WHERE volunteer_id = ? 
                ORDER BY visit_date ASC
            `)
            .all(volunteerId);
        res.status(200).json({ success: true, visits });
    }
    catch (err) {
        console.error("Fetch visits error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});
router.put("/:visitId/feedback", async (req, res) => {
    try {
        BaseModels_1.BaseModel.init();
        const visitId = req.params.visitId;
        const { findings } = req.body;
        if (!findings || !findings.trim()) {
            return res.status(400).json({ success: false, message: "Findings cannot be empty" });
        }
        const result = BaseModels_1.BaseModel.db
            .prepare(`
                UPDATE verification_visits
                SET status = 'completed',
                    findings = ?,
                    completed_at = datetime('now')
                WHERE visit_id = ?
            `)
            .run(findings, visitId);
        if (result.changes === 0) {
            return res.status(404).json({ success: false, message: "Visit not found" });
        }
        const updatedVisit = BaseModels_1.BaseModel.db
            .prepare(`SELECT * FROM verification_visits WHERE visit_id = ?`)
            .get(visitId);
        res.status(200).json({ success: true, visit: updatedVisit });
    }
    catch (err) {
        console.error("Submit feedback error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});
exports.default = router;
