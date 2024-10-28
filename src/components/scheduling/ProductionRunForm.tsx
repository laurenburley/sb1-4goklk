import React, { useState, useEffect } from 'react';
import { Calendar, Package, Users, Beaker, Clock } from 'lucide-react';
import { ProductionRun, ProductionStatus, ResourceType } from '../../types/scheduling';
import { Recipe } from '../../types/recipe';

interface ProductionRunFormProps {
  onSubmit: (data: Partial<ProductionRun>) => void;
  onCancel: () => void;
  initialData?: ProductionRun;
}

function ProductionRunForm({ onSubmit, onCancel, initialData }: ProductionRunFormProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [formData, setFormData] = useState({
    recipeId: initialData?.recipeId || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    batchSize: initialData?.batchSize?.toString() || '',
    expectedYield: initialData?.expectedYield?.toString() || '',
    assignedStaff: initialData?.assignedStaff || [],
    resources: initialData?.resources || [],
    notes: initialData?.notes || '',
    status: initialData?.status || ProductionStatus.SCHEDULED,
  });

  // Load recipes from localStorage
  useEffect(() => {
    const savedRecipes = localStorage.getItem('recipes');
    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedRecipe = recipes.find(r => r.id === formData.recipeId);
    
    onSubmit({
      ...formData,
      batchSize: parseFloat(formData.batchSize),
      expectedYield: parseFloat(formData.expectedYield),
      recipe: selectedRecipe ? {
        name: selectedRecipe.name,
        spiritType: selectedRecipe.spiritType,
      } : undefined,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-fill batch size and yield when recipe is selected
    if (name === 'recipeId') {
      const selectedRecipe = recipes.find(r => r.id === value);
      if (selectedRecipe) {
        setFormData(prev => ({
          ...prev,
          batchSize: selectedRecipe.batchSize.toString(),
          expectedYield: selectedRecipe.estimatedYield.toString(),
        }));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Production Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe
            </label>
            <select
              name="recipeId"
              value={formData.recipeId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select recipe</option>
              {recipes.map(recipe => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.name} ({recipe.spiritType})
                </option>
              ))}
            </select>
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
              {Object.values(ProductionStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch Size (L)
            </label>
            <div className="relative">
              <input
                type="number"
                name="batchSize"
                value={formData.batchSize}
                onChange={handleChange}
                step="0.1"
                min="0"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <Beaker className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Yield (L)
            </label>
            <div className="relative">
              <input
                type="number"
                name="expectedYield"
                value={formData.expectedYield}
                onChange={handleChange}
                step="0.1"
                min="0"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <Beaker className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Resource Allocation</h3>
        {/* Add resource allocation controls here */}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Additional Notes</h3>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Any additional notes or instructions..."
        />
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
          {initialData ? 'Update Production Run' : 'Schedule Production Run'}
        </button>
      </div>
    </form>
  );
}

export default ProductionRunForm;