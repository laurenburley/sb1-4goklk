import React, { useState, useEffect } from 'react';
import { Calendar, Percent, Droplet } from 'lucide-react';
import { ProductionBatch, BatchStatus } from '../../types/production';
import { Recipe } from '../../types/recipe';

interface BatchFormProps {
  onSubmit: (data: Partial<ProductionBatch>) => void;
  onCancel: () => void;
  initialData?: ProductionBatch | null;
  recipes: Recipe[];
}

function BatchForm({ onSubmit, onCancel, initialData, recipes }: BatchFormProps) {
  const [formData, setFormData] = useState({
    batchNumber: '',
    productionDate: initialData?.productionDate || new Date().toISOString().split('T')[0],
    spiritType: initialData?.spiritType || '',
    ingredients: initialData?.ingredients || '',
    volumeProduced: initialData?.volumeProduced?.toString() || '',
    volumeUnit: initialData?.volumeUnit || 'L',
    abv: initialData?.abv?.toString() || '',
    notes: initialData?.notes || '',
    status: initialData?.status || BatchStatus.PLANNED,
    recipeId: initialData?.recipeId || '',
  });

  useEffect(() => {
    if (!initialData) {
      // Generate sequential batch number for new batches
      const year = new Date().getFullYear();
      const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
      const lastBatchNumber = localStorage.getItem('lastBatchNumber') || '0';
      const sequence = (parseInt(lastBatchNumber) + 1).toString().padStart(3, '0');
      const newBatchNumber = `B${year}${month}-${sequence}`;
      
      setFormData(prev => ({
        ...prev,
        batchNumber: newBatchNumber
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        batchNumber: initialData.batchNumber,
        recipeId: initialData.recipeId || ''
      }));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update last batch number in localStorage
    if (!initialData) {
      const sequence = formData.batchNumber.split('-')[1];
      localStorage.setItem('lastBatchNumber', sequence);
    }

    // Get selected recipe
    const selectedRecipe = recipes.find(r => r.id === formData.recipeId);

    onSubmit({
      ...formData,
      volumeProduced: parseFloat(formData.volumeProduced),
      abv: parseFloat(formData.abv),
      // If a recipe is selected, use its spirit type and ingredients
      spiritType: selectedRecipe?.spiritType || formData.spiritType,
      ingredients: selectedRecipe ? 
        selectedRecipe.ingredients.map(i => `${i.name} (${i.quantity}${i.unit})`).join(', ') :
        formData.ingredients,
      recipeId: formData.recipeId || undefined
    });
  };

  const handleRecipeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const recipeId = e.target.value;
    const selectedRecipe = recipes.find(r => r.id === recipeId);
    
    if (selectedRecipe) {
      setFormData(prev => ({
        ...prev,
        recipeId,
        spiritType: selectedRecipe.spiritType,
        volumeProduced: selectedRecipe.batchSize.toString(),
        volumeUnit: selectedRecipe.batchUnit,
        abv: selectedRecipe.targetABV.toString(),
        ingredients: selectedRecipe.ingredients.map(i => `${i.name} (${i.quantity}${i.unit})`).join(', ')
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe
            </label>
            <select
              name="recipeId"
              value={formData.recipeId}
              onChange={handleRecipeChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select recipe (optional)</option>
              {recipes.map(recipe => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.name} ({recipe.spiritType})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch Number
            </label>
            <input
              type="text"
              name="batchNumber"
              value={formData.batchNumber}
              readOnly
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Production Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="productionDate"
                value={formData.productionDate}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {Object.values(BatchStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients
            </label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter ingredients list"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volume Produced
            </label>
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="number"
                    name="volumeProduced"
                    value={formData.volumeProduced}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <Droplet className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <select
                name="volumeUnit"
                value={formData.volumeUnit}
                onChange={handleChange}
                className="w-24 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="L">L</option>
                <option value="GAL">GAL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ABV (%)
            </label>
            <div className="relative">
              <input
                type="number"
                name="abv"
                value={formData.abv}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <Percent className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Additional notes (optional)"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {initialData ? 'Update Batch' : 'Create Batch'}
        </button>
      </div>
    </form>
  );
}

export default BatchForm;