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

// ── NEW: Awareness module routes ────────
import adminRoutes from './routes/adminRoutes';         // Admin-only (protected + role checked)
import awarenessRoutes from './routes/awarenessRoutes'; // Public content (articles, videos, guides)

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

// ── NEW: Mount awareness routes ──────────
app.use('/api/admin', adminRoutes);         // → POST/GET/PATCH/DELETE awareness-contents (admin only)
app.use('/api/awareness', awarenessRoutes); // → GET published content (public / mobile app)

// ── Start server ────────────────────── ───
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving static uploads from: ${path.join(__dirname, '..', 'public', 'uploads')}`);
  
  // Helpful logs for the new module
  console.log(`Public awareness content → http://localhost:${PORT}/api/awareness`);
  console.log(`Admin awareness panel     → http://localhost:${PORT}/api/admin/awareness-contents`);
});