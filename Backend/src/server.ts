// src/server.ts
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import indexRouter from './routes/index';
import authRoutes from './routes/authRoutes';
import familyRoutes from './routes/familyroutes';        // ← FIXED
import caseReporterRoutes from './routes/caseReporterRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Uploads folder
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// === ALL ROUTES — BEFORE listen() ===
app.use('/', indexRouter);
app.use('/api/auth', authRoutes);
app.use('/api/auth/families', familyRoutes);     // ← NOW WORKS
app.use('/case', caseReporterRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    working: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/auth/families/enroll (with Bearer token)',
      'GET  /api/auth/families/my (with Bearer token)'
    ]
  });
});

// Start server — LAST LINE
app.listen(PORT, () => {
  console.log(`ChildGuard Backend LIVE → http://localhost:${PORT}`);
});