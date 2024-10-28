import React, { useState } from 'react';
import { Calendar, Beaker, Thermometer, FileText } from 'lucide-react';
import { DistillationRecord, DistillationRecordType } from '../../types/compliance';

interface DistillationRecordFormProps {
  onSubmit: (data: Partial<DistillationRecord>) => void;
  onCancel: () => void;
  initialData?: DistillationRecord;
}

function DistillationRecordForm({ onSubmit, onCancel, initialData }: DistillationRecordFormProps) {
  const [formData, setFormData] = useState({
    type: initialData?.type || DistillationRecordType.PRODUCTION,
    date: initialData?.date || new Date().toISOString().split('T')[0],
    batchNumber: initialData?.batchNumber || '',
    rawMaterials: initialData?.rawMaterials || [],
    productionDetails: initialData?.productionDetails || {
      startTime: '',
      endTime: '',
      washVolume: 0,
      washAlcoholContent: 0,
      spiritVolume: 0,
      spiritAlcoholContent: 0,
      operatorName: '',
    },
    notes: initialData?.notes || '',
  });

  const [newMaterial, setNewMaterial] = useState({
    name: '',
    quantity: '',
    unit: '',
    supplier: '',
    invoiceNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductionDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      productionDetails: {
        ...prev.productionDetails,
        [name]: name.includes('Volume') || name.includes('Content') ? parseFloat(value) : value,
      },
    }));
  };

  const handleAddMaterial = () => {
    if (newMaterial.name && newMaterial.quantity && newMaterial.unit) {
      setFormData(prev => ({
        ...prev,
        rawMaterials: [
          ...prev.rawMaterials,
          {
            ...newMaterial,
            quantity: parseFloat(newMaterial.quantity),
          },
        ],
      }));
      setNewMaterial({
        name: '',
        quantity: '',
        unit: '',
        supplier: '',
        invoiceNumber: '',
      });
    }
  };

  const handleRemoveMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rawMaterials: prev.rawMaterials.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Distillation Record</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Record Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {Object.values(DistillationRecordType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
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
        </div>

        {formData.type === DistillationRecordType.PRODUCTION && (
          <>
            <h4 className="text-md font-medium text-gray-900 mt-8 mb-4">Production Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.productionDetails.startTime}
                  onChange={handleProductionDetailsChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.productionDetails.endTime}
                  onChange={handleProductionDetailsChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wash Volume (L)
                </label>
                <input
                  type="number"
                  name="washVolume"
                  value={formData.productionDetails.washVolume}
                  onChange={handleProductionDetailsChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wash Alcohol Content (%)
                </label>
                <input
                  type="number"
                  name="washAlcoholContent"
                  value={formData.productionDetails.washAlcoholContent}
                  onChange={handleProductionDetailsChange}
                  step="0.1"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spirit Volume (L)
                </label>
                <input
                  type="number"
                  name="spiritVolume"
                  value={formData.productionDetails.spiritVolume}
                  onChange={handleProductionDetailsChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spirit Alcohol Content (%)
                </label>
                <input
                  type="number"
                  name="spiritAlcoholContent"
                  value={formData.productionDetails.spiritAlcoholContent}
                  onChange={handleProductionDetailsChange}
                  step="0.1"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operator Name
                </label>
                <input
                  type="text"
                  name="operatorName"
                  value={formData.productionDetails.operatorName}
                  onChange={handleProductionDetailsChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <h4 className="text-md font-medium text-gray-900 mt-8 mb-4">Raw Materials</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder="Material Name"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, name: e.target.value }))}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newMaterial.quantity}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, quantity: e.target.value }))}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={newMaterial.unit}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, unit: e.target.value }))}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Supplier"
                  value={newMaterial.supplier}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, supplier: e.target.value }))}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddMaterial}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Material
                </button>
              </div>

              {formData.rawMaterials.map((material, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="grid grid-cols-4 gap-4 flex-1">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{material.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {material.quantity} {material.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{material.supplier || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{material.invoiceNumber || '-'}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMaterial(index)}
                    className="ml-4 text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Additional notes or observations..."
          />
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
          {initialData ? 'Update Record' : 'Create Record'}
        </button>
      </div>
    </form>
  );
}

export default DistillationRecordForm;