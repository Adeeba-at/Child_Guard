// src/server.ts
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

// ── All existing routes ─────────────────────
import indexRouter from './routes/index';
import authRoutes from './routes/authRoutes';
import familyRoutes from './routes/familyroutes';
import caseReporterRoutes from './routes/caseReporterRoutes';

// ── Other module routes ────────
import visitsRoutes from './routes/visitsRoutes';
import volunteerRoutes from './routes/volunteerRoutes';
import userRoutes from './routes/UserRoutes';

// ── Awareness module ───────────────────
import adminRoutes from './routes/adminRoutes';
import awarenessRoutes from './routes/awarenessRoutes';

// ── Sponsor routes (includes available children) ───────
import sponsorRoutes from "./routes/sponsorRoutes";

// ⚠️ DEBUG: Check if sponsorRoutes imported correctly
console.log('📦 sponsorRoutes imported:', sponsorRoutes);
console.log('📦 Type:', typeof sponsorRoutes);

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files (photos, documents, etc.)
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// ── Route mounting (in logical order) ───────
app.use('/', indexRouter);

app.use('/api/auth', authRoutes);
app.use('/api/auth/families', familyRoutes);
app.use('/case', caseReporterRoutes);

app.use('/visits', visitsRoutes);
app.use('/volunteer', volunteerRoutes);
app.use('/user', userRoutes);
app.use('/availability', userRoutes);

// ── Awareness Module Routes ─────────────────
app.use('/api/admin', adminRoutes);
app.use('/api/awareness', awarenessRoutes);

// ── SPONSOR ROUTES (includes /children/available) ───
console.log('🔧 Registering sponsor routes at /api/sponsor');
app.use("/api/sponsor", sponsorRoutes);
console.log('✅ Sponsor routes registered');

// ⚠️ DEBUG: Print all registered routes
app._router.stack.forEach((middleware: any) => {
  if (middleware.route) {
    console.log('📍 Route:', middleware.route.path);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach((handler: any) => {
      if (handler.route) {
        console.log('📍 Mounted route:', handler.route.path);
      }
    });
  }
});

// ── 404 Handler ─────────────────────────────
app.use((req, res) => {
  console.log('❌ 404 Hit for:', req.method, req.url);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedUrl: req.url,
    requestedMethod: req.method,
    availableEndpoints: [
      'POST   /api/auth/register',
      'POST   /api/auth/login',
      'POST   /api/families/enroll',
      'GET    /api/awareness/articles',
      'GET    /case/reports',
      'GET    /api/sponsor/:sponsorId/children',
      'GET    /api/sponsor/:sponsorId/applications',
      'GET    /api/sponsor/:sponsorId/reports',
      'GET    /api/sponsor/children/available',
      'GET    /uploads/... (photos)'
    ]
  });
});

// ── Start Server ────────────────────────────
app.listen(PORT, () => {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`ChildGuard Backend LIVE → http://localhost:${PORT}`);
  console.log(`Static uploads → http://localhost:${PORT}/uploads`);
  console.log(`Public awareness → http://localhost:${PORT}/api/awareness`);
  console.log(`Admin panel → http://localhost:${PORT}/api/admin`);
  console.log(`Sponsor dashboard → http://localhost:${PORT}/api/sponsor`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});

export default app;