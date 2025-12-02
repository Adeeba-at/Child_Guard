// src/server.ts 

import express from 'express';
import cors from 'cors';
import path from 'path';

// ── Existing routes ─────────────────────
import authRoutes from './routes/authRoutes';
import indexRouter from './routes/index';
import caseReporterRoutes from "./routes/caseReporterRoutes";
import visitsRoutes from "./routes/visitsRoutes";
import volunteerRoutes from "./routes/volunteerRoutes";
import userRoutes from "./routes/UserRoutes";

// ── NEW: Awareness module routes ─────────
import adminRoutes from './routes/adminRoutes';
import awarenessRoutes from './routes/awarenessRoutes';

// ── NEW: Sponsor module route ───────────
import sponsorRoutes from "./routes/sponsorRouts";   // ⭐ IMPORTANT

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// ── Route mounting ───────────────────────
app.use('/', indexRouter);
app.use('/api/auth', authRoutes);
app.use("/case", caseReporterRoutes);
app.use("/visits", visitsRoutes);
app.use("/volunteer", volunteerRoutes);
app.use("/user", userRoutes);
app.use("/availability", userRoutes);

// ── Awareness routes ─────────────────────
app.use('/api/admin', adminRoutes);
app.use('/api/awareness', awarenessRoutes);

// ── ⭐ NEW: SPONSOR ROUTES MOUNTED HERE ────
app.use("/api/sponsor", sponsorRoutes); 
// Example endpoints now working:
// GET  → /api/sponsor/profile/:id
// GET  → /api/sponsor/matching-children/:id
// GET  → /api/sponsor/my-sponsored-children/:id
// POST → /api/sponsor/sponsor-child

// ── Start server ─────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving static uploads from: ${path.join(__dirname, '..', 'public', 'uploads')}`);

  console.log(`Public awareness content → http://localhost:${PORT}/api/awareness`);
  console.log(`Admin awareness panel     → http://localhost:${PORT}/api/admin/awareness-contents`);
  console.log(`Sponsor API base          → http://localhost:${PORT}/api/sponsor`);
});
