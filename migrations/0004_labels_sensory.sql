-- Label Management Tables
CREATE TABLE label_themes (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  name TEXT NOT NULL,
  colors TEXT NOT NULL, -- JSON object
  logo TEXT NOT NULL, -- JSON object
  fonts TEXT NOT NULL, -- JSON object
  terminology TEXT NOT NULL, -- JSON object
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE label_templates (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  dimensions TEXT NOT NULL, -- JSON object
  elements TEXT NOT NULL, -- JSON array
  compliance_regions TEXT NOT NULL, -- JSON array
  preview_url TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE label_designs (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  template_id TEXT NOT NULL REFERENCES label_templates(id),
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  version INTEGER NOT NULL,
  elements TEXT NOT NULL, -- JSON array
  approvals TEXT NOT NULL, -- JSON array
  compliance_checks TEXT NOT NULL, -- JSON array
  preview_url TEXT NOT NULL,
  export_url TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Sensory Analysis Tables
CREATE TABLE sensory_attributes (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  min_score REAL NOT NULL,
  max_score REAL NOT NULL,
  reference_standards TEXT -- JSON array
);

CREATE TABLE tasters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT NOT NULL,
  certifications TEXT, -- JSON array
  experience_years INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE tasting_sessions (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  spirit_type TEXT NOT NULL,
  batch_number TEXT NOT NULL,
  sample_id TEXT NOT NULL,
  blind_tasting BOOLEAN NOT NULL DEFAULT false,
  tasters TEXT NOT NULL, -- JSON array
  scores TEXT NOT NULL, -- JSON array
  consensus_notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);