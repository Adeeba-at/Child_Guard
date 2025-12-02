import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// DB stays at project root
const DB_FILE = path.join(process.cwd(), "childguard.db");

// SCHEMA file path works in both src and dist
const SCHEMA_FILE = path.join(__dirname, "schema.sql");

export class DatabaseConnection {
    private static instance: Database.Database | null = null;

    static getInstance(): Database.Database {
        if (!this.instance) {
            const isNew = !fs.existsSync(DB_FILE);

            this.instance = new Database(DB_FILE);

            this.instance.pragma("foreign_keys = ON");

            if (isNew && fs.existsSync(SCHEMA_FILE)) {
                console.log(`[DB] Database created. Running schema from: ${SCHEMA_FILE}`);
                const schema = fs.readFileSync(SCHEMA_FILE, "utf8");
                this.instance.exec(schema);
                console.log("[DB] Schema executed successfully.");
            } else if (!fs.existsSync(SCHEMA_FILE)) {
                console.error(`[DB ERROR] Schema file not found at: ${SCHEMA_FILE}`);
            }
        }
        return this.instance;
    }
}
