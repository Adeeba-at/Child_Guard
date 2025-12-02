"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// ── All existing routes ─────────────────────
const index_1 = __importDefault(require("./routes/index"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const familyroutes_1 = __importDefault(require("./routes/familyroutes"));
const caseReporterRoutes_1 = __importDefault(require("./routes/caseReporterRoutes"));
// ── Other module routes ────────
const visitsRoutes_1 = __importDefault(require("./routes/visitsRoutes"));
const volunteerRoutes_1 = __importDefault(require("./routes/volunteerRoutes"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
// ── Awareness module ───────────────────
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const awarenessRoutes_1 = __importDefault(require("./routes/awarenessRoutes"));
// ── Sponsor routes (includes available children) ───────
const sponsorRoutes_1 = __importDefault(require("./routes/sponsorRoutes"));
// ⚠️ DEBUG: Check if sponsorRoutes imported correctly
console.log('📦 sponsorRoutes imported:', sponsorRoutes_1.default);
console.log('📦 Type:', typeof sponsorRoutes_1.default);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// ── Middleware ─────────────────────────────
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Serve uploaded files (photos, documents, etc.)
const uploadsDir = path_1.default.join(__dirname, '..', 'public', 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express_1.default.static(uploadsDir));
// ── Route mounting (in logical order) ───────
app.use('/', index_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/auth/families', familyroutes_1.default);
app.use('/case', caseReporterRoutes_1.default);
app.use('/visits', visitsRoutes_1.default);
app.use('/volunteer', volunteerRoutes_1.default);
app.use('/user', UserRoutes_1.default);
app.use('/availability', UserRoutes_1.default);
// ── Awareness Module Routes ─────────────────
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/awareness', awarenessRoutes_1.default);
// ── SPONSOR ROUTES (includes /children/available) ───
console.log('🔧 Registering sponsor routes at /api/sponsor');
app.use("/api/sponsor", sponsorRoutes_1.default);
console.log('✅ Sponsor routes registered');
// ⚠️ DEBUG: Print all registered routes
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log('📍 Route:', middleware.route.path);
    }
    else if (middleware.name === 'router') {
        middleware.handle.stack.forEach((handler) => {
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
exports.default = app;
