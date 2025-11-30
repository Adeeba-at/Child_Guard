import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export interface AuthPayload {
  user_id: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

// Middleware to verify token for any logged-in user
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) 
    return res.status(401).json({ message: "Authorization header missing" });

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) 
    return res.status(401).json({ message: 'Token format is "Bearer [token]"' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = decoded; // attach decoded payload to req.user
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Middleware to allow only admins
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== "admin") 
    return res.status(403).json({ message: "Admin access required" });
  next();
};
