import React, { useState } from 'react';
import { Calendar, Droplet, Percent, FileText } from 'lucide-react';
import { Barrel } from '../../types/barrelManagement';

interface BarrelFillFormProps {
  barrel: Barrel;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

function BarrelFillForm({ barrel, onSubmit, onCancel }: BarrelFillFormProps) {
  const [formData, setFormData] = useState({
    spiritType: '',
    batchNumber: '',
    fillDate: new Date().toISOString().split('T')[0],
    originalVolume: '',
    originalAbv: '',
    targetAge: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      originalVolume: parseFloat(formData.originalVolume),
      originalAbv: parseFloat(formData.originalAbv),
      targetAge: parseFloat(formData.targetAge),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Fill Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Spirit Type
            </label>
            <input
              type="text"
              name="spiritType"
              value={formData.spiritType}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              placeholder="e.g., Single Malt Whiskey"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch Number
            </label>
            <input
              type="text"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              placeholder="e.g., BATCH-2024-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fill Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="fillDate"
                value={formData.fillDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Volume (L)
            </label>
            <div className="relative">
              <input
                type="number"
                name="originalVolume"
                value={formData.originalVolume}
                onChange={handleChange}
                step="0.1"
                min="0"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <Droplet className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original ABV (%)
            </label>
            <div className="relative">
              <input
                type="number"
                name="originalAbv"
                value={formData.originalAbv}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="100"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <Percent className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Age (years)
            </label>
            <input
              type="number"
              name="targetAge"
              value={formData.targetAge}
              onChange={handleChange}
              step="0.5"
              min="0"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Any additional notes about this fill..."
            />
          </div>
        </div>
      </div>

      {barrel.currentFill && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <FileText className="w-5 h-5 text-yellow-500 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Current Fill Information</h4>
              <p className="mt-1 text-sm text-yellow-600">
                This barrel currently contains {barrel.currentFill.spiritType} (Batch {barrel.currentFill.batchNumber}).
                Adding a new fill will move the current fill to the fill history.
              </p>
            </div>
          </div>
        </div>
      )}

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
          Add Fill
        </button>
      </div>
    </form>
  );
}

export default BarrelFillForm;