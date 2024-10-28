import React, { useState, useEffect } from 'react';
import { Package, DollarSign } from 'lucide-react';
import { Ingredient } from '../../types/recipe';
import { InventoryItem, InventoryCategory } from '../../types/inventory';

interface IngredientManagerProps {
  ingredients: Ingredient[];
  onSave: (ingredients: Ingredient[]) => void;
  onCancel: () => void;
}

const UNITS_OF_MEASUREMENT = [
  { value: 'g', label: 'Grams (g)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'L', label: 'Liters (L)' },
  { value: 'mL', label: 'Milliliters (mL)' },
  { value: 'units', label: 'Units' },
] as const;

function IngredientManager({ ingredients: initialIngredients, onSave, onCancel }: IngredientManagerProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients || []);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: '',
    unit: '',
    costPerUnit: '',
    notes: '',
    inventoryId: '',
  });

  useEffect(() => {
    // Load inventory items from localStorage
    const savedItems = localStorage.getItem('inventory');
    if (savedItems) {
      const items = JSON.parse(savedItems);
      // Only show raw materials, supplies, and botanicals
      const filteredItems = items.filter((item: InventoryItem) => 
        item.category === InventoryCategory.RAW_MATERIALS || 
        item.category === InventoryCategory.SUPPLIES ||
        item.category === InventoryCategory.BOTANICALS
      );
      setInventoryItems(filteredItems);
    }
  }, []);

  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.quantity && newIngredient.unit) {
      const ingredient: Ingredient = {
        id: Date.now().toString(),
        name: newIngredient.name,
        quantity: parseFloat(newIngredient.quantity),
        unit: newIngredient.unit,
        costPerUnit: newIngredient.costPerUnit ? parseFloat(newIngredient.costPerUnit) : undefined,
        notes: newIngredient.notes || undefined,
        inventoryId: newIngredient.inventoryId || undefined,
      };

      setIngredients(prev => [...prev, ingredient]);
      setNewIngredient({
        name: '',
        quantity: '',
        unit: '',
        costPerUnit: '',
        notes: '',
        inventoryId: '',
      });
    }
  };

  const handleInventorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const inventoryId = e.target.value;
    if (inventoryId) {
      const item = inventoryItems.find(i => i.id === inventoryId);
      if (item) {
        setNewIngredient({
          name: item.name,
          quantity: '',
          unit: item.unitOfMeasurement,
          costPerUnit: item.costPerUnit.toString(),
          notes: '',
          inventoryId,
        });
      }
    } else {
      setNewIngredient({
        name: '',
        quantity: '',
        unit: '',
        costPerUnit: '',
        notes: '',
        inventoryId: '',
      });
    }
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(prev => prev.filter(ing => ing.id !== id));
  };

  const handleSave = () => {
    onSave(ingredients);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Manage Ingredients</h2>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Add Ingredient</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select from Inventory (Optional)
                </label>
                <select
                  value={newIngredient.inventoryId}
                  onChange={handleInventorySelect}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Manual Entry</option>
                  {inventoryItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.quantity} {item.unitOfMeasurement} available)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ingredient name"
                    readOnly={!!newIngredient.inventoryId}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient(prev => ({ ...prev, quantity: e.target.value }))}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={newIngredient.unit}
                    onChange={(e) => setNewIngredient(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={!!newIngredient.inventoryId}
                  >
                    <option value="">Select unit</option>
                    {UNITS_OF_MEASUREMENT.map(unit => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost per Unit
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={newIngredient.costPerUnit}
                      onChange={(e) => setNewIngredient(prev => ({ ...prev, costPerUnit: e.target.value }))}
                      step="0.01"
                      min="0"
                      className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0.00"
                      readOnly={!!newIngredient.inventoryId}
                    />
                    <DollarSign className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <input
                  type="text"
                  value={newIngredient.notes}
                  onChange={(e) => setNewIngredient(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Optional notes"
                />
              </div>

              <button
                type="button"
                onClick={handleAddIngredient}
                disabled={!newIngredient.name || !newIngredient.quantity || !newIngredient.unit}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Ingredient
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Current Ingredients</h3>
            {ingredients.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No ingredients added yet</p>
            ) : (
              ingredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="grid grid-cols-4 gap-4 flex-1">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{ingredient.name}</p>
                      {ingredient.inventoryId && (
                        <p className="text-xs text-indigo-600">From Inventory</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {ingredient.quantity} {ingredient.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {ingredient.costPerUnit ? `$${ingredient.costPerUnit.toFixed(2)}/${ingredient.unit}` : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{ingredient.notes || '-'}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ingredient.id)}
                    className="ml-4 text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save Ingredients
          </button>
        </div>
      </div>
    </div>
  );
}

export default IngredientManager;