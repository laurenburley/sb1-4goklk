import React, { useState } from 'react';
import { Calendar, Beaker, User } from 'lucide-react';
import { Test, TestType, TestStatus } from '../../types/quality';

interface TestFormProps {
  onSubmit: (data: Partial<Test>) => void;
  onCancel: () => void;
  initialData?: Test;
}

function TestForm({ onSubmit, onCancel, initialData }: TestFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || TestType.SENSORY,
    batchNumber: initialData?.batchNumber || '',
    sampleId: initialData?.sampleId || '',
    scheduledDate: initialData?.scheduledDate?.split('T')[0] || '',
    status: initialData?.status || TestStatus.PENDING,
    parameters: initialData?.parameters || [],
    notes: initialData?.notes || '',
    performedBy: initialData?.performedBy || '',
  });

  const [newParameter, setNewParameter] = useState({
    name: '',
    value: '',
    unit: '',
    minRange: '',
    maxRange: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      parameters: formData.parameters.map(param => ({
        ...param,
        minRange: parseFloat(param.minRange.toString()),
        maxRange: parseFloat(param.maxRange.toString()),
        value: param.value ? parseFloat(param.value.toString()) : undefined,
      })),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddParameter = () => {
    if (newParameter.name && newParameter.unit && newParameter.minRange && newParameter.maxRange) {
      setFormData(prev => ({
        ...prev,
        parameters: [
          ...prev.parameters,
          {
            name: newParameter.name,
            unit: newParameter.unit,
            minRange: parseFloat(newParameter.minRange),
            maxRange: parseFloat(newParameter.maxRange),
            value: newParameter.value ? parseFloat(newParameter.value) : undefined,
          },
        ],
      }));
      setNewParameter({
        name: '',
        value: '',
        unit: '',
        minRange: '',
        maxRange: '',
      });
    }
  };

  const handleRemoveParameter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Test Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Name
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
              Test Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {Object.values(TestType).map(type => (
                <option key={type} value={type}>{type}</option>
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
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sample ID
            </label>
            <input
              type="text"
              name="sampleId"
              value={formData.sampleId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scheduled Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
              {Object.values(TestStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Performed By
            </label>
            <div className="relative">
              <input
                type="text"
                name="performedBy"
                value={formData.performedBy}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Test Parameters</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Parameter Name"
              value={newParameter.name}
              onChange={(e) => setNewParameter(prev => ({ ...prev, name: e.target.value }))}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Unit"
              value={newParameter.unit}
              onChange={(e) => setNewParameter(prev => ({ ...prev, unit: e.target.value }))}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              placeholder="Min Range"
              value={newParameter.minRange}
              onChange={(e) => setNewParameter(prev => ({ ...prev, minRange: e.target.value }))}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              placeholder="Max Range"
              value={newParameter.maxRange}
              onChange={(e) => setNewParameter(prev => ({ ...prev, maxRange: e.target.value }))}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddParameter}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add
            </button>
          </div>

          {formData.parameters.map((param, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{param.name}</p>
                <p className="text-sm text-gray-500">
                  Range: {param.minRange} - {param.maxRange} {param.unit}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveParameter(index)}
                className="text-red-600 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Additional Notes</h3>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Any additional notes or observations..."
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
          {initialData ? 'Update Test' : 'Create Test'}
        </button>
      </div>
    </form>
  );
}

export default TestForm;