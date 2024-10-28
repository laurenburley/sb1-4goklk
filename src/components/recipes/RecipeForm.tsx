import React, { useState } from 'react';
import { Plus, Minus, Scale, History, Beaker } from 'lucide-react';
import { Recipe, SpiritType, UnitOfMeasurement, RecipeStatus, Ingredient, ProductionStep } from '../../types/recipe';
import IngredientManager from './IngredientManager';
import RecipeScaler from './RecipeScaler';
import VersionHistory from './VersionHistory';

interface RecipeFormProps {
  onSubmit: (data: Partial<Recipe>) => void;
  onCancel: () => void;
  initialData?: Recipe;
}

function RecipeForm({ onSubmit, onCancel, initialData }: RecipeFormProps) {
  const [showIngredients, setShowIngredients] = useState(false);
  const [showScaler, setShowScaler] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    spiritType: initialData?.spiritType || '',
    description: initialData?.description || '',
    batchSize: initialData?.batchSize?.toString() || '',
    batchUnit: initialData?.batchUnit || '',
    initialABV: initialData?.initialABV?.toString() || '',
    ingredients: initialData?.ingredients || [],
    steps: initialData?.steps || [],
    fermentationDetails: initialData?.fermentationDetails || {
      duration: 0,
      temperature: 20,
      yeastType: '',
    },
    distillationDetails: initialData?.distillationDetails || {
      cuts: [],
      notes: '',
    },
    agingDetails: initialData?.agingDetails || {
      required: false,
      duration: 0,
      container: '',
      notes: '',
    },
    status: initialData?.status || RecipeStatus.DRAFT,
    tags: initialData?.tags || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      batchSize: parseFloat(formData.batchSize),
      initialABV: parseFloat(formData.initialABV),
    });
  };

  const handleIngredientUpdate = (ingredients: Ingredient[]) => {
    setFormData(prev => ({ ...prev, ingredients }));
    setShowIngredients(false);
  };

  const handleScaleRecipe = (scaleFactor: number) => {
    const scaledIngredients = formData.ingredients.map(ingredient => ({
      ...ingredient,
      quantity: ingredient.quantity * scaleFactor,
    }));
    setFormData(prev => ({
      ...prev,
      batchSize: (parseFloat(prev.batchSize) * scaleFactor).toString(),
      ingredients: scaledIngredients,
    }));
    setShowScaler(false);
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipe Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spirit Type
          </label>
          <select
            name="spiritType"
            value={formData.spiritType}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Select spirit type</option>
            {Object.values(SpiritType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Batch Size
          </label>
          <div className="flex space-x-4">
            <input
              type="number"
              name="batchSize"
              value={formData.batchSize}
              onChange={handleChange}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <select
              name="batchUnit"
              value={formData.batchUnit}
              onChange={handleChange}
              className="w-24 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Unit</option>
              {Object.values(UnitOfMeasurement).map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initial ABV (%)
          </label>
          <input
            type="number"
            name="initialABV"
            value={formData.initialABV}
            onChange={handleChange}
            step="0.1"
            min="0"
            max="100"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Initial alcohol by volume of base spirit
          </p>
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
            {Object.values(RecipeStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Next: Ingredients
        </button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setShowIngredients(true)}
            className="btn-secondary flex items-center"
          >
            <Beaker className="w-4 h-4 mr-2" />
            Manage Ingredients
          </button>
          <button
            type="button"
            onClick={() => setShowScaler(true)}
            className="btn-secondary flex items-center"
          >
            <Scale className="w-4 h-4 mr-2" />
            Scale Recipe
          </button>
          {initialData && (
            <button
              type="button"
              onClick={() => setShowHistory(true)}
              className="btn-secondary flex items-center"
            >
              <History className="w-4 h-4 mr-2" />
              Version History
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {currentStep === 1 && renderBasicInfo()}
      </div>

      {showIngredients && (
        <IngredientManager
          ingredients={formData.ingredients}
          onSave={handleIngredientUpdate}
          onCancel={() => setShowIngredients(false)}
        />
      )}

      {showScaler && (
        <RecipeScaler
          currentBatchSize={parseFloat(formData.batchSize)}
          currentUnit={formData.batchUnit as UnitOfMeasurement}
          onScale={handleScaleRecipe}
          onCancel={() => setShowScaler(false)}
        />
      )}

      {showHistory && initialData && (
        <VersionHistory
          recipeId={initialData.id}
          onClose={() => setShowHistory(false)}
        />
      )}
    </form>
  );
}

export default RecipeForm;