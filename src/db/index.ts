import Database from "better-sqlite3";
import { join, dirname } from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "..", "..", "data.sqlite");

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const schema = readFileSync(join(__dirname, "schema.sql"), "utf-8");
for (const statement of schema.split(";")) {
  const trimmed = statement.trim();
  if (trimmed) db.exec(trimmed + ";");
}

// Seed pricing_settings if empty
const existingPricing = db.prepare("SELECT 1 FROM pricing_settings LIMIT 1").get();
if (!existingPricing) {
  db.prepare(
    `INSERT INTO pricing_settings (id, hour_rate, visit_fee, default_margin, warranty_days, quote_validity_days, urgency_fast, urgency_emergency, urgency_after_hours)
     VALUES (1, 100, 70, 25, 90, 7, 15, 30, 50)`
  ).run();
}

export function generateId(prefix = "id"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function generateNumber(prefix: string, seq: number): string {
  return `${prefix}-${String(seq).padStart(4, "0")}`;
}

// Auto-seed on first import in server context
import { seedDatabase } from "./seed";
seedDatabase();
