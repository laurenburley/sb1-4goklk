import React, { useState } from 'react';
import { DollarSign, Calendar, FileText } from 'lucide-react';
import { CostEntry, CostCategoryType, AllocationMethod } from '../../types/costAnalysis';

interface CostEntryFormProps {
  onSubmit: (data: Partial<CostEntry>) => void;
  onCancel: () => void;
  initialData?: CostEntry;
  spiritRunId: string;
}

function CostEntryForm({ onSubmit, onCancel, initialData, spiritRunId }: CostEntryFormProps) {
  const [formData, setFormData] = useState({
    category: initialData?.category || '',
    description: initialData?.description || '',
    amount: initialData?.amount?.toString() || '',
    quantity: initialData?.quantity?.toString() || '',
    unit: initialData?.unit || '',
    unitCost: initialData?.unitCost?.toString() || '',
    allocationMethod: initialData?.allocationMethod || AllocationMethod.VOLUME,
    allocationBasis: initialData?.allocationBasis?.toString() || '100',
    date: initialData?.date?.split('T')[0] || new Date().toISOString().split('T')[0],
    notes: initialData?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      spiritRunId,
      amount: parseFloat(formData.amount),
      quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
      unitCost: formData.unitCost ? parseFloat(formData.unitCost) : undefined,
      allocationBasis: parseFloat(formData.allocationBasis),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-calculate amount if quantity and unit cost are provided
    if ((name === 'quantity' || name === 'unitCost') && formData.quantity && formData.unitCost) {
      const quantity = parseFloat(name === 'quantity' ? value : formData.quantity);
      const unitCost = parseFloat(name === 'unitCost' ? value : formData.unitCost);
      if (!isNaN(quantity) && !isNaN(unitCost)) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          amount: (quantity * unitCost).toString(),
        }));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Cost Entry Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cost Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select category</option>
              {Object.values(CostCategoryType).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex space-x-4">
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="Unit"
                className="w-24 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit Cost
            </label>
            <div className="relative">
              <input
                type="number"
                name="unitCost"
                value={formData.unitCost}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Amount
            </label>
            <div className="relative">
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
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
              Allocation Method
            </label>
            <select
              name="allocationMethod"
              value={formData.allocationMethod}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {Object.values(AllocationMethod).map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allocation Basis (%)
            </label>
            <input
              type="number"
              name="allocationBasis"
              value={formData.allocationBasis}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.1"
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
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Additional notes or comments..."
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
          {initialData ? 'Update Cost Entry' : 'Add Cost Entry'}
        </button>
      </div>
    </form>
  );
}

export default CostEntryForm;