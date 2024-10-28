-- Quality Control Tables
CREATE TABLE quality_tests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  batch_number TEXT NOT NULL,
  sample_id TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  completed_date TEXT,
  performed_by TEXT,
  reviewed_by TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE test_parameters (
  id TEXT PRIMARY KEY,
  test_id TEXT NOT NULL REFERENCES quality_tests(id),
  name TEXT NOT NULL,
  value REAL,
  unit TEXT NOT NULL,
  min_range REAL NOT NULL,
  max_range REAL NOT NULL,
  result TEXT
);

CREATE TABLE quality_samples (
  id TEXT PRIMARY KEY,
  batch_number TEXT NOT NULL,
  product_name TEXT NOT NULL,
  status TEXT NOT NULL,
  collection_date TEXT NOT NULL,
  collection_location TEXT NOT NULL,
  collected_by TEXT NOT NULL,
  storage_location TEXT NOT NULL,
  temperature REAL NOT NULL,
  humidity REAL,
  expiration_date TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE sample_custody (
  id TEXT PRIMARY KEY,
  sample_id TEXT NOT NULL REFERENCES quality_samples(id),
  date TEXT NOT NULL,
  action TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  notes TEXT
);

-- Production Tables
CREATE TABLE production_runs (
  id TEXT PRIMARY KEY,
  recipe_id TEXT NOT NULL REFERENCES recipes(id),
  batch_number TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  status TEXT NOT NULL,
  current_stage TEXT NOT NULL,
  batch_size REAL NOT NULL,
  expected_yield REAL NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE production_resources (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES production_runs(id),
  type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  name TEXT NOT NULL
);

CREATE TABLE production_staff (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES production_runs(id),
  staff_id TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL
);

CREATE TABLE production_stages (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES production_runs(id),
  name TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  status TEXT NOT NULL,
  notes TEXT
);