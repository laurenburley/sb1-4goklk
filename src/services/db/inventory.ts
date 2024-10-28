import { getData, setData } from '../../db/firebase';
import { InventoryItem, InventoryCategory, StockStatus } from '../../types/inventory';

// Use Firebase Realtime Database for inventory management
export async function getAllInventoryItems(): Promise<InventoryItem[]> {
  try {
    const data = await getData('/inventory');
    return data ? Object.values(data) : [];
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    throw error;
  }
}

export async function getInventoryItemById(id: string): Promise<InventoryItem | null> {
  try {
    const item = await getData(`/inventory/${id}`);
    return item || null;
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    throw error;
  }
}

export async function createInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
  try {
    const id = crypto.randomUUID();
    const newItem: InventoryItem = {
      ...item,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await setData(`/inventory/${id}`, newItem);
    return newItem;
  } catch (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }
}

export async function updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> {
  try {
    const currentItem = await getInventoryItemById(id);
    if (!currentItem) {
      throw new Error('Inventory item not found');
    }

    const updatedItem = {
      ...currentItem,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await setData(`/inventory/${id}`, updatedItem);
    return updatedItem;
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
}

export async function deleteInventoryItem(id: string): Promise<void> {
  try {
    await setData(`/inventory/${id}`, null);
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
}

export async function updateInventoryBatch(updates: { id: string; quantity: number }[]): Promise<void> {
  try {
    const updatePromises = updates.map(async ({ id, quantity }) => {
      const item = await getInventoryItemById(id);
      if (item) {
        const newStatus = quantity <= (item.reorderPoint || 0) 
          ? StockStatus.LOW_STOCK 
          : StockStatus.IN_STOCK;
        
        return updateInventoryItem(id, { 
          quantity,
          status: newStatus
        });
      }
    });

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error updating inventory batch:', error);
    throw error;
  }
}