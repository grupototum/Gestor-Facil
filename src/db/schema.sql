-- Schema do Gestor Facil (SQLite)

CREATE TABLE IF NOT EXISTS company (
  id TEXT PRIMARY KEY DEFAULT 'c1',
  name TEXT NOT NULL,
  tagline TEXT,
  whatsapp TEXT NOT NULL,
  phone TEXT,
  instagram TEXT,
  google_profile TEXT,
  region TEXT NOT NULL,
  hours TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#2d3aa8'
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  neighborhood TEXT NOT NULL,
  address TEXT,
  type TEXT NOT NULL DEFAULT 'Residencial',
  origin TEXT NOT NULL DEFAULT 'Outro',
  notes TEXT,
  total_spent INTEGER NOT NULL DEFAULT 0,
  service_count INTEGER NOT NULL DEFAULT 0,
  referrals_made INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  billing TEXT NOT NULL DEFAULT 'Fixo',
  average_minutes INTEGER NOT NULL DEFAULT 60,
  base_price INTEGER NOT NULL DEFAULT 0,
  default_complexity TEXT NOT NULL DEFAULT 'Simples',
  needs_parts INTEGER NOT NULL DEFAULT 0,
  has_warranty INTEGER NOT NULL DEFAULT 1,
  warranty_days INTEGER NOT NULL DEFAULT 90,
  checklist TEXT NOT NULL DEFAULT '[]',
  customer_message TEXT,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS pricing_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  hour_rate INTEGER NOT NULL DEFAULT 100,
  visit_fee INTEGER NOT NULL DEFAULT 70,
  default_margin INTEGER NOT NULL DEFAULT 25,
  warranty_days INTEGER NOT NULL DEFAULT 90,
  quote_validity_days INTEGER NOT NULL DEFAULT 7,
  urgency_fast INTEGER NOT NULL DEFAULT 15,
  urgency_emergency INTEGER NOT NULL DEFAULT 30,
  urgency_after_hours INTEGER NOT NULL DEFAULT 50
);

CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL REFERENCES customers(id),
  service_id TEXT NOT NULL REFERENCES services(id),
  problem TEXT NOT NULL,
  billing TEXT NOT NULL,
  complexity TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'Normal',
  estimated_minutes INTEGER NOT NULL DEFAULT 60,
  travel_fee INTEGER NOT NULL DEFAULT 0,
  parts_cost INTEGER NOT NULL DEFAULT 0,
  parts_margin INTEGER NOT NULL DEFAULT 20,
  discount INTEGER NOT NULL DEFAULT 0,
  value_min INTEGER NOT NULL DEFAULT 0,
  value_recommended INTEGER NOT NULL DEFAULT 0,
  value_premium INTEGER NOT NULL DEFAULT 0,
  final_value INTEGER NOT NULL DEFAULT 0,
  warranty_enabled INTEGER NOT NULL DEFAULT 1,
  warranty_days INTEGER NOT NULL DEFAULT 90,
  warranty_coverage TEXT NOT NULL DEFAULT 'Mão de obra',
  status TEXT NOT NULL DEFAULT 'Rascunho',
  validity_date TEXT,
  public_token TEXT NOT NULL UNIQUE,
  internal_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS work_orders (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL REFERENCES customers(id),
  service_id TEXT NOT NULL REFERENCES services(id),
  quote_id TEXT REFERENCES quotes(id),
  address TEXT NOT NULL,
  scheduled_at TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  technician TEXT NOT NULL DEFAULT 'João',
  checklist TEXT NOT NULL DEFAULT '[]',
  photos_before TEXT NOT NULL DEFAULT '[]',
  photos_after TEXT NOT NULL DEFAULT '[]',
  parts TEXT NOT NULL DEFAULT '[]',
  technical_notes TEXT,
  payment_method TEXT,
  payment_status TEXT NOT NULL DEFAULT 'Pendente',
  warranty_active INTEGER NOT NULL DEFAULT 0,
  warranty_until TEXT,
  public_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'Nova',
  timeline TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  work_order_id TEXT REFERENCES work_orders(id),
  customer_id TEXT NOT NULL REFERENCES customers(id),
  amount INTEGER NOT NULL DEFAULT 0,
  method TEXT NOT NULL,
  date TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  date TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS protocols (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  steps TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS checklist_templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  items TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS pops (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS slas (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  target TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ok'
);

CREATE TABLE IF NOT EXISTS message_templates (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  body TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS referrals (
  id TEXT PRIMARY KEY,
  from_customer_id TEXT NOT NULL REFERENCES customers(id),
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  service_type TEXT NOT NULL,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'Nova',
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS followups (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers(id),
  work_order_id TEXT NOT NULL REFERENCES work_orders(id),
  kind TEXT NOT NULL,
  due_date TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  message TEXT NOT NULL
);
