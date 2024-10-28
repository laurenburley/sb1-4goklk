import React, { useState } from 'react';
import { Star, Eye, Wind, Coffee, Clock, Beaker, ThermometerSun, TestTube } from 'lucide-react';

interface QualityControlProps {
  batchId: string;
  onSubmit: (data: any) => void;
}

function QualityControl({ batchId, onSubmit }: QualityControlProps) {
  const [formData, setFormData] = useState({
    // Sensory Evaluation
    appearance: {
      clarity: '',
      color: '',
      viscosity: '',
      score: '',
      notes: ''
    },
    aroma: {
      intensity: '',
      complexity: '',
      characteristics: '',
      score: '',
      notes: ''
    },
    taste: {
      balance: '',
      body: '',
      characteristics: '',
      score: '',
      notes: ''
    },
    finish: {
      length: '',
      characteristics: '',
      score: '',
      notes: ''
    },
    // Technical Analysis
    abv: '',
    ph: '',
    temperature: '',
    congeners: '',
    // Overall
    overallScore: '',
    overallNotes: '',
    taster: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending'
  });

  const handleChange = (category: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      batchId,
      ...formData,
      timestamp: new Date().toISOString()
    });
  };

  const renderScoreInput = (category: string, field: string, label: string, max: number = 10) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max={max}
          step="0.5"
          value={formData[category as keyof typeof formData][field as any] || 0}
          onChange={(e) => handleChange(category, field, e.target.value)}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sensory Evaluation */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Sensory Evaluation</h3>
        
        {/* Appearance */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center">
            <Eye className="w-5 h-5 text-gray-400 mr-2" />
            <h4 className="text-base font-medium text-gray-900">Appearance</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderScoreInput('appearance', 'score', 'Overall Score')}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.appearance.notes}
                onChange={(e) => handleChange('appearance', 'notes', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe clarity, color, viscosity..."
              />
            </div>
          </div>
        </div>

        {/* Aroma */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center">
            <Wind className="w-5 h-5 text-gray-400 mr-2" />
            <h4 className="text-base font-medium text-gray-900">Aroma</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderScoreInput('aroma', 'score', 'Overall Score')}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.aroma.notes}
                onChange={(e) => handleChange('aroma', 'notes', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe intensity, complexity, characteristics..."
              />
            </div>
          </div>
        </div>

        {/* Taste */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center">
            <Coffee className="w-5 h-5 text-gray-400 mr-2" />
            <h4 className="text-base font-medium text-gray-900">Taste</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderScoreInput('taste', 'score', 'Overall Score')}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.taste.notes}
                onChange={(e) => handleChange('taste', 'notes', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe balance, body, flavor characteristics..."
              />
            </div>
          </div>
        </div>

        {/* Finish */}
        <div className="space-y-6">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-gray-400 mr-2" />
            <h4 className="text-base font-medium text-gray-900">Finish</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderScoreInput('finish', 'score', 'Overall Score')}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.finish.notes}
                onChange={(e) => handleChange('finish', 'notes', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe length and characteristics..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Technical Analysis */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Technical Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ABV (%)
            </label>
            <div className="relative">
              <input
                type="number"
                name="abv"
                value={formData.abv}
                onChange={handleSimpleChange}
                step="0.1"
                min="0"
                max="100"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <Beaker className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              pH Level
            </label>
            <div className="relative">
              <input
                type="number"
                name="ph"
                value={formData.ph}
                onChange={handleSimpleChange}
                step="0.1"
                min="0"
                max="14"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <Beaker className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature (°C)
            </label>
            <div className="relative">
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleSimpleChange}
                step="0.1"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <ThermometerSun className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Congeners (mg/L)
            </label>
            <div className="relative">
              <input
                type="number"
                name="congeners"
                value={formData.congeners}
                onChange={handleSimpleChange}
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

      {/* Overall Assessment */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Overall Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Score
            </label>
            <div className="relative">
              <input
                type="number"
                name="overallScore"
                value={formData.overallScore}
                onChange={handleSimpleChange}
                step="0.5"
                min="0"
                max="100"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <Star className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleSimpleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="needs_adjustment">Needs Adjustment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taster
            </label>
            <input
              type="text"
              name="taster"
              value={formData.taster}
              onChange={handleSimpleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleSimpleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Notes
            </label>
            <textarea
              name="overallNotes"
              value={formData.overallNotes}
              onChange={handleSimpleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Additional observations, recommendations, or concerns..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Submit Quality Control Report
        </button>
      </div>
    </form>
  );
}

export default QualityControl;