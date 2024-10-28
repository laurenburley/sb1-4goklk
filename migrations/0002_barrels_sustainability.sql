-- Barrel Management Tables
CREATE TABLE barrels (
  id TEXT PRIMARY KEY,
  barrel_number TEXT NOT NULL,
  type TEXT NOT NULL,
  size TEXT NOT NULL,
  custom_size REAL,
  status TEXT NOT NULL,
  location TEXT NOT NULL,
  warehouse TEXT NOT NULL,
  rack TEXT NOT NULL,
  position TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  purchase_date TEXT NOT NULL,
  first_fill_date TEXT,
  total_fills INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE barrel_fills (
  id TEXT PRIMARY KEY,
  barrel_id TEXT NOT NULL REFERENCES barrels(id),
  spirit_type TEXT NOT NULL,
  batch_number TEXT NOT NULL,
  fill_date TEXT NOT NULL,
  empty_date TEXT,
  original_volume REAL NOT NULL,
  final_volume REAL,
  original_abv REAL NOT NULL,
  final_abv REAL,
  target_age INTEGER NOT NULL,
  notes TEXT,
  is_current BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE barrel_maintenance (
  id TEXT PRIMARY KEY,
  barrel_id TEXT NOT NULL REFERENCES barrels(id),
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  cost REAL,
  notes TEXT
);

-- Sustainability Tables
CREATE TABLE resource_consumption (
  id TEXT PRIMARY KEY,
  resource_type TEXT NOT NULL,
  amount REAL NOT NULL,
  unit TEXT NOT NULL,
  date TEXT NOT NULL,
  batch_number TEXT,
  process TEXT NOT NULL,
  equipment TEXT,
  cost REAL NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE waste_records (
  id TEXT PRIMARY KEY,
  waste_type TEXT NOT NULL,
  amount REAL NOT NULL,
  unit TEXT NOT NULL,
  date TEXT NOT NULL,
  disposal_method TEXT NOT NULL,
  disposal_partner TEXT NOT NULL,
  cost REAL NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE carbon_emissions (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  category TEXT NOT NULL,
  amount REAL NOT NULL,
  unit TEXT NOT NULL,
  date TEXT NOT NULL,
  calculation_method TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE sustainability_goals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  target_value REAL NOT NULL,
  current_value REAL NOT NULL,
  unit TEXT NOT NULL,
  start_date TEXT NOT NULL,
  target_date TEXT NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);