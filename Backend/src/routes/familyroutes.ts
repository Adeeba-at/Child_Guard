// backend/src/routes/familyRoutes.ts
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { FamilyController } from '../controllers/familycontroller';

// Since your controller uses AuthRequest, we cast it safely here
type AuthRequest = Request & {
  user: {
    user_id: string;
    role: string;
    email?: string;
  };
};

const router = Router();

// Now TypeScript is happy — no overload errors, no any, no tricks
router.post('/enroll', authMiddleware, (req: Request, res: Response) =>
  FamilyController.enroll(req as AuthRequest, res)
);

router.get('/my', authMiddleware, (req: Request, res: Response) =>
  FamilyController.getMyFamily(req as AuthRequest, res)
);

router.get('/', authMiddleware, (req: Request, res: Response) =>
  FamilyController.getAll(req as AuthRequest, res)
);

router.get('/:family_id', authMiddleware, (req: Request, res: Response) =>
  FamilyController.getById(req as AuthRequest, res)
);

router.patch('/:family_id/verify', authMiddleware, (req: Request, res: Response) =>
  FamilyController.verifyFamily(req as AuthRequest, res)
);

router.patch('/:family_id/support', authMiddleware, (req: Request, res: Response) =>
  FamilyController.updateSupportStatus(req as AuthRequest, res)
);

router.patch('/my/proof', authMiddleware, (req: Request, res: Response) =>
  FamilyController.uploadProofDocuments(req as AuthRequest, res)
);

export default router;