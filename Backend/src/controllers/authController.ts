// src/controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { DatabaseConnection } from "../config/database/DatabaseConnection";
import { User } from "../models/User";

type AuthDbUser = Pick<User, 'user_id' | 'username' | 'email' | 'password_hash' | 'role'>;
type AuthResponseUser = Omit<AuthDbUser, 'password_hash'>;

const JWT_SECRET = "your_jwt_secret";

export class AuthController {
   
    static register(req: Request, res: Response) {
        try {
            const db = DatabaseConnection.getInstance();
            const { username, email, password, role, phone, address, area, preferences } = req.body;

            const allowedRoles = ["parent", "sponsor", "volunteer", "admin", "case_reporter"];
            if (!allowedRoles.includes(role)) {
                return res.status(400).json({ error: "Invalid user role" });
            }

            // Check if user already exists
            const existing = db.prepare("SELECT * FROM users WHERE email = ? OR username = ?")
                               .get(email, username);
            if (existing) return res.status(400).json({ error: "User already exists" });

            // Hash password
            const hash = bcrypt.hashSync(password, 10);

            // Generate unique user ID
            const user_id = `USR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            // Begin transaction
            const newUser = db.transaction(() => {
                // Insert into users table
                db.prepare(`
                    INSERT INTO users (user_id, username, email, password_hash, role)
                    VALUES (?, ?, ?, ?, ?)
                `).run(user_id, username, email, hash, role);

                // Insert into role-specific table
                switch (role) {
                    case "parent":
                        db.prepare(`
                            INSERT INTO parents (parent_id, phone, address)
                            VALUES (?, ?, ?)
                        `).run(user_id, phone ?? null, address ?? null);
                        break;

                    case "sponsor":
                        const prefsJson = preferences ? JSON.stringify(preferences) : null;
                        db.prepare(`
                            INSERT INTO sponsors (
                                sponsor_id,
                                name,
                                email,
                                password,
                                phone,
                                preferences,
                                status,
                                address
                            )
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        `).run(
                            user_id,
                            username,          // using username as name
                            email,
                            hash,
                            phone ?? null,
                            prefsJson ?? null,
                            "active",          // default status
                            address ?? null
                        );
                        break;

                    case "volunteer":
                        db.prepare(`
                            INSERT INTO volunteers (volunteer_id, phone, area, status)
                            VALUES (?, ?, ?, ?)
                        `).run(
                            user_id,
                            phone ?? null,
                            area ?? null,
                            "pending"
                        );
                        break;

                    default:
                        break;
                }

                // Return the user (without password)
                return db.prepare(`
                    SELECT user_id, username, email, role FROM users WHERE user_id = ?
                `).get(user_id) as AuthResponseUser;
            })();

            // Generate JWT token
            const token = jwt.sign({ user_id: newUser.user_id, role: newUser.role }, JWT_SECRET, { expiresIn: "1h" });

            res.status(201).json({
                message: "Registration successful",
                user: newUser,
                token,
            });
        } catch (err) {
            console.error("Registration error:", err);
            res.status(500).json({ 
                error: "Registration failed", 
                details: err instanceof Error ? err.message : String(err) 
            });
        }
    }

    static login(req: Request, res: Response) {
        try {
            const db = DatabaseConnection.getInstance();
            const { email, password } = req.body;

            const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email) as AuthDbUser | undefined;
            if (!user) return res.status(400).json({ error: "User not found" });

            const valid = bcrypt.compareSync(password, user.password_hash);
            if (!valid) return res.status(400).json({ error: "Invalid password" });

            const token = jwt.sign({ user_id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

            res.json({
                message: "Login successful",
                token,
                user: {
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                } as AuthResponseUser,
            });
        } catch (err) {
            console.error("Login error:", err);
            res.status(500).json({ 
                error: "Login failed", 
                details: err instanceof Error ? err.message : String(err) 
            });
        }
    }
}
