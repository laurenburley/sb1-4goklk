import React, { useState, useEffect } from 'react';
import { Calendar, Beaker } from 'lucide-react';
import { Experiment, ExperimentType, ExperimentStatus, EquipmentType } from '../../types/researchDevelopment';
import { Recipe, RecipeStatus, SpiritType } from '../../types/recipe';
import { InventoryItem } from '../../types/inventory';

interface ExperimentFormProps {
  onSubmit: (data: Partial<Experiment>) => void;
  onCancel: () => void;
  onConvertToRecipe?: (recipe: Partial<Recipe>) => void;
  initialData?: Experiment;
}

const ExperimentForm = ({ onSubmit, onCancel, onConvertToRecipe, initialData }: ExperimentFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || '',
    status: initialData?.status || ExperimentStatus.DRAFT,
    description: initialData?.description || '',
    objectives: initialData?.objectives || [''],
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    endDate: initialData?.endDate || '',
    assignedTeam: initialData?.assignedTeam || [],
    ingredients: initialData?.ingredients || [],
    notes: initialData?.notes || '',
    initialABV: initialData?.initialABV?.toString() || '',
    finishedABV: initialData?.finishedABV?.toString() || '',
    ethanolVolume: initialData?.ethanolVolume?.toString() || '',
    finishedVolume: initialData?.finishedVolume?.toString() || '',
    equipment: initialData?.equipment || '',
    experimentNotes: initialData?.experimentNotes || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      initialABV: formData.initialABV ? parseFloat(formData.initialABV) : undefined,
      finishedABV: formData.finishedABV ? parseFloat(formData.finishedABV) : undefined,
      ethanolVolume: formData.ethanolVolume ? parseFloat(formData.ethanolVolume) : undefined,
      finishedVolume: formData.finishedVolume ? parseFloat(formData.finishedVolume) : undefined,
    });
  };

  const handleConvertToRecipe = () => {
    if (!onConvertToRecipe || !formData) return;

    const recipe: Recipe = {
      id: Date.now().toString(),
      name: formData.name,
      spiritType: SpiritType.GIN,
      description: formData.description,
      batchSize: 0,
      batchUnit: 'L',
      initialABV: parseFloat(formData.initialABV || '0'),
      ingredients: formData.ingredients,
      steps: [],
      fermentationDetails: {
        duration: 0,
        temperature: 20,
        yeastType: '',
      },
      distillationDetails: {
        cuts: [],
        notes: formData.notes,
      },
      tastingNotes: [],
      tags: [],
      status: RecipeStatus.DRAFT,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'System',
      updatedBy: 'System',
    };

    onConvertToRecipe(recipe as any);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          {onConvertToRecipe && (
            <button
              type="button"
              onClick={handleConvertToRecipe}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Convert to Recipe
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experiment Name
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
              Equipment
            </label>
            <select
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select equipment</option>
              {Object.values(EquipmentType).map(equipment => (
                <option key={equipment} value={equipment}>{equipment}</option>
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
                min={formData.startDate}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Finished ABV (%)
            </label>
            <input
              type="number"
              name="finishedABV"
              value={formData.finishedABV}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="100"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ethanol Volume (L)
            </label>
            <input
              type="number"
              name="ethanolVolume"
              value={formData.ethanolVolume}
              onChange={handleChange}
              step="0.1"
              min="0"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Finished Volume (L)
            </label>
            <input
              type="number"
              name="finishedVolume"
              value={formData.finishedVolume}
              onChange={handleChange}
              step="0.1"
              min="0"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select type</option>
              {Object.values(ExperimentType).map(type => (
                <option key={type} value={type}>{type}</option>
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
              {Object.values(ExperimentStatus).map(status => (
                <option key={status} value={status}>{status}</option>
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

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experiment Notes
            </label>
            <textarea
              name="experimentNotes"
              value={formData.experimentNotes}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Record your observations, methods, and results here..."
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
          {initialData ? 'Update Experiment' : 'Create Experiment'}
        </button>
      </div>
    </form>
  );
};

export default ExperimentForm;