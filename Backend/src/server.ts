// src/server.ts
// FINAL MERGED VERSION — COMPLETE CHILDGUARD BACKEND
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

// ── Import centralized routes (all modules: volunteer, admin, parent, sponsor, etc.)
import routes from './routes/index'; // ← This router includes all modules
import sponsorRoutes from './routes/sponsorRoutes';
const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));                    // Support large file uploads (photos, docs)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Serve uploaded files (photos, documents, awareness images, etc.)
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));
app.use('/uploads', express.static(uploadsDir)); 

app.use('/challans', express.static(path.join(__dirname, '../public/challans')));

// ── Mount ALL API routes under /api + legacy direct mounts
app.use('/api', routes);        // Modern API
app.use('/', routes);           // Legacy support

// Optional legacy direct mounts for backward compatibility
app.use('/volunteer', routes);
app.use('/case', routes);
app.use('/visits', routes);
app.use('/user', routes);
app.use('/availability', routes);
app.use("/api/sponsor", sponsorRoutes); 
// ── 404 Handler — Helpful for debugging
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    tip: 'Use correct path under /api or legacy direct paths',
    availableEndpoints: [
      'POST   /api/auth/register',
      'POST   /api/auth/login',
      'GET    /api/admin/volunteers',
      'POST   /volunteer/:id/request',
      'GET    /case/reports',
      'POST   /api/parent/register-family',
      'GET    /api/parent/challans',
      'GET    /api/awareness/articles',
      'GET    /uploads/... (images, documents)',
      'GET    / (API welcome message)'
    ],
    team: "Built with love by You & Your Amazing Friend"
  });
});

// ── Start Server ─────────────────────────
app.listen(PORT, () => {
  console.log(`\nChildGuard Backend LIVE → http://localhost:${PORT}`);
  console.log(`Static uploads     → http://localhost:${PORT}/uploads`);
  console.log(`API Root           → http://localhost:${PORT}/api`);
  console.log(`Legacy Routes      → /volunteer, /case, /admin, etc.`);
  console.log(`Admin Panel        → http://localhost:${PORT}/api/admin`);
  console.log(`Public Awareness   → http://localhost:${PORT}/api/awareness`);
  console.log(`Parent Dashboard   → http://localhost:${PORT}/api/parent`);
  console.log(`\nAll systems merged successfully! Volunteer + Admin + Parent = FULL POWER\n`);
});

export default app;
