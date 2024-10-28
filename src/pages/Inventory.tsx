import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import InventoryDashboard from '../components/inventory/InventoryDashboard';
import InventoryList from '../components/inventory/InventoryList';
import InventoryForm from '../components/inventory/InventoryForm';
import { InventoryItem, InventoryCategory, StockStatus } from '../types/inventory';
import { useInitialData } from '../context/InitialDataContext';

function Inventory() {
  const { inventory, setInventory } = useInitialData();
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const metrics = {
    totalValue: inventory.reduce((sum, item) => sum + (item.quantity * item.costPerUnit), 0),
    uniqueProducts: inventory.length,
    lowStockItems: inventory.filter(item => item.quantity <= (item.reorderPoint || 0)).length,
    expiringItems: inventory.filter(item => {
      if (!item.expirationDate) return false;
      const daysUntilExpiration = Math.ceil(
        (new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiration <= 30;
    }).length,
  };

  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleFormSubmit = (data: Partial<InventoryItem>) => {
    if (selectedItem) {
      // Update existing item
      const updatedInventory = inventory.map(item =>
        item.id === selectedItem.id
          ? {
              ...item,
              ...data,
              updatedAt: new Date().toISOString(),
              status: (data.quantity || 0) <= (data.reorderPoint || item.reorderPoint || 0)
                ? StockStatus.LOW_STOCK
                : StockStatus.IN_STOCK,
            }
          : item
      );
      setInventory(updatedInventory);
    } else {
      // Create new item
      const newItem: InventoryItem = {
        id: crypto.randomUUID(),
        name: data.name || '',
        sku: data.sku || '',
        category: data.category || InventoryCategory.RAW_MATERIALS,
        description: data.description || '',
        quantity: data.quantity || 0,
        unitOfMeasurement: data.unitOfMeasurement || '',
        location: data.location || '',
        reorderPoint: data.reorderPoint || 0,
        costPerUnit: data.costPerUnit || 0,
        supplier: data.supplier || '',
        status: (data.quantity || 0) <= (data.reorderPoint || 0)
          ? StockStatus.LOW_STOCK
          : StockStatus.IN_STOCK,
        batchNumber: data.batchNumber,
        expirationDate: data.expirationDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setInventory([...inventory, newItem]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-8">
      {!showForm ? (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Item
            </button>
          </div>

          <InventoryDashboard metrics={metrics} />

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Inventory Items</h2>
            <InventoryList
              items={inventory}
              onItemClick={handleItemClick}
            />
          </div>
        </>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedItem ? 'Edit Inventory Item' : 'New Inventory Item'}
          </h1>
          <InventoryForm
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedItem(null);
            }}
            initialData={selectedItem}
          />
        </div>
      )}
    </div>
  );
}

export default Inventory;