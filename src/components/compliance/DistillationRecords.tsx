import React, { useState } from 'react';
import { Beaker, Calendar, Thermometer, TestTube } from 'lucide-react';
import { DistillationRecord } from '../../types/compliance';

interface DistillationRecordsProps {
  onSubmit: (data: Partial<DistillationRecord>) => void;
  onCancel: () => void;
  initialData?: DistillationRecord;
}

function DistillationRecords({ onSubmit, onCancel, initialData }: DistillationRecordsProps) {
  const [formData, setFormData] = useState({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    inputMaterials: initialData?.inputMaterials || '',
    inputQuantity: initialData?.inputQuantity?.toString() || '',
    washAlcoholContent: initialData?.washAlcoholContent?.toString() || '',
    outputVolume: initialData?.outputVolume?.toString() || '',
    outputAlcoholContent: initialData?.outputAlcoholContent?.toString() || '',
    samplesTaken: initialData?.samplesTaken || '',
    notes: initialData?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      inputQuantity: parseFloat(formData.inputQuantity),
      washAlcoholContent: parseFloat(formData.washAlcoholContent),
      outputVolume: parseFloat(formData.outputVolume),
      outputAlcoholContent: parseFloat(formData.outputAlcoholContent),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Distillation Record</h3>
        <p className="text-sm text-gray-500 mb-6">
          As per ATO requirements, all distillation records must be accurately maintained and stored for a minimum of 5 years.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Distillation
            </label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input Materials
            </label>
            <div className="relative">
              <input
                type="text"
                name="inputMaterials"
                value={formData.inputMaterials}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Malted Barley, Water, Yeast"
                required
              />
              <Beaker className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input Quantity (kg)
            </label>
            <input
              type="number"
              name="inputQuantity"
              value={formData.inputQuantity}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wash Alcohol Content (%)
            </label>
            <div className="relative">
              <input
                type="number"
                name="washAlcoholContent"
                value={formData.washAlcoholContent}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="100"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <Thermometer className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Volume (L)
            </label>
            <input
              type="number"
              name="outputVolume"
              value={formData.outputVolume}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Alcohol Content (%)
            </label>
            <div className="relative">
              <input
                type="number"
                name="outputAlcoholContent"
                value={formData.outputAlcoholContent}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="100"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <TestTube className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Samples Taken
            </label>
            <input
              type="text"
              name="samplesTaken"
              value={formData.samplesTaken}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Record any samples taken for testing"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Any additional observations or comments..."
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
          {initialData ? 'Update Record' : 'Save Record'}
        </button>
      </div>
    </form>
  );
}

export default DistillationRecords;