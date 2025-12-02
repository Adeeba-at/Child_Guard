"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/familyRoutes.ts
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const familycontroller_1 = require("../controllers/familycontroller");
const router = (0, express_1.Router)();
// Now TypeScript is happy — no overload errors, no any, no tricks
router.post('/enroll', authMiddleware_1.authMiddleware, (req, res) => familycontroller_1.FamilyController.enroll(req, res));
router.get('/my', authMiddleware_1.authMiddleware, (req, res) => familycontroller_1.FamilyController.getMyFamily(req, res));
router.get('/', authMiddleware_1.authMiddleware, (req, res) => familycontroller_1.FamilyController.getAll(req, res));
router.get('/:family_id', authMiddleware_1.authMiddleware, (req, res) => familycontroller_1.FamilyController.getById(req, res));
router.patch('/:family_id/verify', authMiddleware_1.authMiddleware, (req, res) => familycontroller_1.FamilyController.verifyFamily(req, res));
router.patch('/:family_id/support', authMiddleware_1.authMiddleware, (req, res) => familycontroller_1.FamilyController.updateSupportStatus(req, res));
router.patch('/my/proof', authMiddleware_1.authMiddleware, (req, res) => familycontroller_1.FamilyController.uploadProofDocuments(req, res));
exports.default = router;
