"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
// Middleware to verify token for any logged-in user
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
        return res.status(401).json({ message: "Authorization header missing" });
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token)
        return res.status(401).json({ message: 'Token format is "Bearer [token]"' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded; // attach decoded payload to req.user
        next();
    }
    catch (err) {
        console.error("JWT verification error:", err);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.authMiddleware = authMiddleware;
// Middleware to allow only admins
const requireAdmin = (req, res, next) => {
    if (!req.user)
        return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== "admin")
        return res.status(403).json({ message: "Admin access required" });
    next();
};
exports.requireAdmin = requireAdmin;
