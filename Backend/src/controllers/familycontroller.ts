// backend/src/controllers/familyController.ts
import { Request, Response } from 'express';
import { FamilyModel } from '../models/family';

// Extend Request type locally — no global files needed
interface AuthRequest extends Request {
  user: {
    user_id: string;
    role: string;
    email?: string;
  };
}

export class FamilyController {
  // Parent: Apply for support
  static async enroll(req: AuthRequest, res: Response) {
    try {
      const { income, address, proof_documents } = req.body;
      const parent_id = req.user.user_id; // 100% typed, no error!

      if (!income || !address) {
        return res.status(400).json({
          success: false,
          message: 'Income and address are required',
        });
      }

      const family = FamilyModel.create({
        parent_id,
        income,
        address,
        proof_documents: proof_documents || [],
      });

      return res.status(201).json({
        success: true,
        message: 'Family enrolled successfully. Awaiting verification.',
        data: { family },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error',
      });
    }
  }

  // Parent: Get their own family
  static async getMyFamily(req: AuthRequest, res: Response) {
    try {
      const family = FamilyModel.getByParentId(req.user.user_id);

      if (!family) {
        return res.status(404).json({
          success: false,
          message: 'You have not enrolled yet',
        });
      }

      return res.json({
        success: true,
        data: { family },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Admin/Volunteer: Get all families
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const families = FamilyModel.getAll();
      return res.json({ success: true, data: { families } });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get family by ID
  static async getById(req: AuthRequest, res: Response) {
    try {
      const { family_id } = req.params;
      const family = FamilyModel.getById(family_id);

      if (!family) {
        return res.status(404).json({ success: false, message: 'Family not found' });
      }

      return res.json({ success: true, data: { family } });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Volunteer/Admin: Verify family
  static async verifyFamily(req: AuthRequest, res: Response) {
    try {
      const { family_id } = req.params;
      const { status } = req.body; // 'verified' | 'rejected'

      if (!['verified', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      FamilyModel.verifyFamily(family_id, status, req.user.user_id);

      return res.json({
        success: true,
        message: `Family ${status === 'verified' ? 'approved' : 'rejected'}`,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update support status (shortlisted/sponsored)
  static async updateSupportStatus(req: AuthRequest, res: Response) {
    try {
      const { family_id } = req.params;
      const { status, sponsor_id } = req.body;

      if (!['shortlisted', 'sponsored'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      FamilyModel.updateSupportStatus(family_id, status, sponsor_id || null);

      return res.json({
        success: true,
        message: `Family marked as ${status}`,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Parent: Upload proof documents
  static async uploadProofDocuments(req: AuthRequest, res: Response) {
    try {
      const { proof_documents } = req.body;
      const family = FamilyModel.getByParentId(req.user.user_id);

      if (!family) {
        return res.status(404).json({ success: false, message: 'Family not found' });
      }

      FamilyModel.uploadProofDocuments(family.family_id, proof_documents);

      return res.json({ success: true, message: 'Documents uploaded successfully' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}