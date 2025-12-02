"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnection = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// DB stays at project root
const DB_FILE = path_1.default.join(process.cwd(), "childguard.db");
// SCHEMA file path works in both src and dist
const SCHEMA_FILE = path_1.default.join(__dirname, "schema.sql");
class DatabaseConnection {
    static instance = null;
    static getInstance() {
        if (!this.instance) {
            const isNew = !fs_1.default.existsSync(DB_FILE);
            this.instance = new better_sqlite3_1.default(DB_FILE);
            this.instance.pragma("foreign_keys = ON");
            if (isNew && fs_1.default.existsSync(SCHEMA_FILE)) {
                console.log(`[DB] Database created. Running schema from: ${SCHEMA_FILE}`);
                const schema = fs_1.default.readFileSync(SCHEMA_FILE, "utf8");
                this.instance.exec(schema);
                console.log("[DB] Schema executed successfully.");
            }
            else if (!fs_1.default.existsSync(SCHEMA_FILE)) {
                console.error(`[DB ERROR] Schema file not found at: ${SCHEMA_FILE}`);
            }
        }
        return this.instance;
    }
}
exports.DatabaseConnection = DatabaseConnection;
