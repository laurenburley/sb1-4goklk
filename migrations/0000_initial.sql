CREATE TABLE recipes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  spirit_type TEXT NOT NULL,
  description TEXT NOT NULL,
  batch_size REAL NOT NULL,
  batch_unit TEXT NOT NULL,
  initial_abv REAL NOT NULL,
  status TEXT NOT NULL,
  version INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT NOT NULL,
  updated_by TEXT NOT NULL
);

CREATE TABLE recipe_ingredients (
  id TEXT PRIMARY KEY,
  recipe_id TEXT NOT NULL REFERENCES recipes(id),
  name TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  cost_per_unit REAL,
  notes TEXT,
  inventory_id TEXT
);

CREATE TABLE inventory_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  quantity REAL NOT NULL,
  unit_of_measurement TEXT NOT NULL,
  location TEXT,
  reorder_point REAL,
  cost_per_unit REAL,
  supplier TEXT,
  status TEXT NOT NULL,
  batch_number TEXT,
  expiration_date TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE production_batches (
  id TEXT PRIMARY KEY,
  batch_number TEXT NOT NULL,
  production_date TEXT NOT NULL,
  spirit_type TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  volume_produced REAL NOT NULL,
  volume_unit TEXT NOT NULL,
  abv REAL NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  recipe_id TEXT REFERENCES recipes(id),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);