import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Recipes
export const recipes = sqliteTable('recipes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  spiritType: text('spirit_type').notNull(),
  description: text('description').notNull(),
  batchSize: real('batch_size').notNull(),
  batchUnit: text('batch_unit').notNull(),
  initialABV: real('initial_abv').notNull(),
  status: text('status').notNull(),
  version: integer('version').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  createdBy: text('created_by').notNull(),
  updatedBy: text('updated_by').notNull(),
});

// Recipe Ingredients
export const recipeIngredients = sqliteTable('recipe_ingredients', {
  id: text('id').primaryKey(),
  recipeId: text('recipe_id').notNull().references(() => recipes.id),
  name: text('name').notNull(),
  quantity: real('quantity').notNull(),
  unit: text('unit').notNull(),
  costPerUnit: real('cost_per_unit'),
  notes: text('notes'),
  inventoryId: text('inventory_id'),
});

// Inventory Items
export const inventoryItems = sqliteTable('inventory_items', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  sku: text('sku').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  quantity: real('quantity').notNull(),
  unitOfMeasurement: text('unit_of_measurement').notNull(),
  location: text('location'),
  reorderPoint: real('reorder_point'),
  costPerUnit: real('cost_per_unit'),
  supplier: text('supplier'),
  status: text('status').notNull(),
  batchNumber: text('batch_number'),
  expirationDate: text('expiration_date'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Production Batches
export const productionBatches = sqliteTable('production_batches', {
  id: text('id').primaryKey(),
  batchNumber: text('batch_number').notNull(),
  productionDate: text('production_date').notNull(),
  spiritType: text('spirit_type').notNull(),
  ingredients: text('ingredients').notNull(),
  volumeProduced: real('volume_produced').notNull(),
  volumeUnit: text('volume_unit').notNull(),
  abv: real('abv').notNull(),
  status: text('status').notNull(),
  notes: text('notes'),
  recipeId: text('recipe_id').references(() => recipes.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});