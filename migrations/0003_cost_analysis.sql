-- Cost Analysis Tables
CREATE TABLE cost_entries (
  id TEXT PRIMARY KEY,
  spirit_run_id TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  quantity REAL,
  unit TEXT,
  unit_cost REAL,
  allocation_method TEXT NOT NULL,
  allocation_basis REAL NOT NULL,
  date TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE profitability_data (
  id TEXT PRIMARY KEY,
  spirit_run_id TEXT NOT NULL,
  batch_number TEXT NOT NULL,
  production_date TEXT NOT NULL,
  total_costs REAL NOT NULL,
  direct_costs REAL NOT NULL,
  indirect_costs REAL NOT NULL,
  revenue REAL NOT NULL,
  units_produced INTEGER NOT NULL,
  units_sold INTEGER NOT NULL,
  average_selling_price REAL NOT NULL,
  gross_profit REAL NOT NULL,
  net_profit REAL NOT NULL,
  gross_margin REAL NOT NULL,
  net_margin REAL NOT NULL,
  yield_efficiency REAL NOT NULL,
  cost_per_unit REAL NOT NULL,
  profit_per_unit REAL NOT NULL,
  excise_tax_per_unit REAL NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);