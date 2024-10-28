import { setData, removeData } from '../src/db/firebase';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await removeData('/');

    // Add sample recipe
    console.log('Creating recipe...');
    const recipeId = crypto.randomUUID();
    const recipe = {
      id: recipeId,
      name: 'Classic London Dry Gin',
      spiritType: 'GIN',
      description: 'Traditional London Dry Gin with juniper and citrus notes',
      batchSize: 500,
      batchUnit: 'L',
      initialABV: 43.5,
      status: 'ACTIVE',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system',
    };

    await setData(`/recipes/${recipeId}`, recipe);
    console.log('Recipe created:', recipe);

    // Add sample ingredients
    console.log('Creating recipe ingredients...');
    const ingredients = [
      {
        id: crypto.randomUUID(),
        recipeId: recipeId,
        name: 'Juniper Berries',
        quantity: 25,
        unit: 'kg',
        costPerUnit: 45.00,
        notes: 'Premium quality juniper berries',
      },
      {
        id: crypto.randomUUID(),
        recipeId: recipeId,
        name: 'Coriander Seeds',
        quantity: 12.5,
        unit: 'kg',
        costPerUnit: 35.00,
        notes: 'Freshly sourced coriander',
      },
      {
        id: crypto.randomUUID(),
        recipeId: recipeId,
        name: 'Angelica Root',
        quantity: 8,
        unit: 'kg',
        costPerUnit: 55.00,
        notes: 'Dried angelica root',
      },
    ];

    for (const ingredient of ingredients) {
      await setData(`/recipeIngredients/${ingredient.id}`, ingredient);
    }
    console.log('Ingredients created:', ingredients);

    // Add sample inventory items
    console.log('Creating inventory items...');
    const inventoryItems = [
      {
        id: crypto.randomUUID(),
        name: 'Juniper Berries',
        sku: 'JB-001',
        category: 'RAW_MATERIALS',
        description: 'Premium quality juniper berries for gin production',
        quantity: 100,
        unitOfMeasurement: 'kg',
        location: 'Warehouse A',
        reorderPoint: 25,
        costPerUnit: 45.00,
        supplier: 'Premium Botanicals Ltd',
        status: 'IN_STOCK',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        name: 'Glass Bottles 750ml',
        sku: 'BTL-750',
        category: 'PACKAGING',
        description: 'Standard 750ml glass bottles',
        quantity: 5000,
        unitOfMeasurement: 'units',
        location: 'Warehouse B',
        reorderPoint: 1000,
        costPerUnit: 2.50,
        supplier: 'Glass Solutions Inc',
        status: 'IN_STOCK',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const item of inventoryItems) {
      await setData(`/inventoryItems/${item.id}`, item);
    }
    console.log('Inventory items created:', inventoryItems);

    // Add sample production batch
    console.log('Creating production batch...');
    const batch = {
      id: crypto.randomUUID(),
      batchNumber: 'B2024-001',
      productionDate: new Date().toISOString(),
      spiritType: 'GIN',
      ingredients: 'Juniper Berries (25kg), Coriander Seeds (12.5kg), Angelica Root (8kg)',
      volumeProduced: 500,
      volumeUnit: 'L',
      abv: 43.5,
      status: 'IN_PROGRESS',
      notes: 'Initial test batch for new gin recipe',
      recipeId: recipeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setData(`/productionBatches/${batch.id}`, batch);
    console.log('Production batch created:', batch);

    console.log('✨ Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    process.exit(1);
  }
}

seed();