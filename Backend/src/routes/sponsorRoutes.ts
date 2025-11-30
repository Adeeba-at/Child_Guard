import { Router } from "express";
import { sponsorController } from "../controllers/sponsorControllers";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Admin routes
router.get("/sponsors", authMiddleware, sponsorController.getAll);
router.patch("/sponsors/:sponsor_id/approve", authMiddleware, sponsorController.approve);
router.patch("/sponsors/:sponsor_id/reject", authMiddleware, sponsorController.reject);

export default router;
