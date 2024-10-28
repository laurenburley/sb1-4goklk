import React, { useState } from 'react';
import { Calculator, DollarSign, Calendar, AlertCircle } from 'lucide-react';

// Current ATO excise rates as of 2024
const ATO_RATES = {
  SPIRITS: {
    STANDARD: 94.74, // Per liter of pure alcohol
    BRANDY: 85.27,   // Per liter of pure alcohol
  },
  BEER: {
    COMMERCIAL: 54.94,    // Per liter of pure alcohol
    CRAFT_BREWERY: 27.47, // Per liter of pure alcohol
  }
};

interface ExciseCalculatorProps {
  onCalculate: (result: {
    amount: number;
    details: string;
    periodStart: string;
    periodEnd: string;
  }) => void;
}

function ExciseCalculator({ onCalculate }: ExciseCalculatorProps) {
  const [formData, setFormData] = useState({
    productType: 'SPIRITS',
    subType: 'STANDARD',
    volume: '',
    alcoholContent: '',
    periodStart: '',
    periodEnd: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateExcise = (e: React.FormEvent) => {
    e.preventDefault();
    
    const volume = parseFloat(formData.volume);
    const alcoholContent = parseFloat(formData.alcoholContent) / 100;
    const lpa = volume * alcoholContent; // Liters of pure alcohol
    
    let rate = 0;
    if (formData.productType === 'SPIRITS') {
      rate = formData.subType === 'BRANDY' ? ATO_RATES.SPIRITS.BRANDY : ATO_RATES.SPIRITS.STANDARD;
    } else {
      rate = formData.subType === 'CRAFT_BREWERY' ? ATO_RATES.BEER.CRAFT_BREWERY : ATO_RATES.BEER.COMMERCIAL;
    }
    
    const amount = lpa * rate;
    const details = `${volume}L at ${formData.alcoholContent}% ABV = ${lpa.toFixed(2)}LPA × $${rate}/LPA`;
    
    onCalculate({
      amount,
      details,
      periodStart: formData.periodStart,
      periodEnd: formData.periodEnd,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Calculator className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="ml-3 text-lg font-medium text-gray-900">ATO Excise Duty Calculator</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Current ATO Rates</h4>
            <p className="text-sm text-blue-600 mt-1">
              Spirits: ${ATO_RATES.SPIRITS.STANDARD}/LPA<br />
              Brandy: ${ATO_RATES.SPIRITS.BRANDY}/LPA
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={calculateExcise} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Type
            </label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="SPIRITS">Spirits</option>
              <option value="BEER">Beer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub Type
            </label>
            <select
              name="subType"
              value={formData.subType}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {formData.productType === 'SPIRITS' ? (
                <>
                  <option value="STANDARD">Standard Spirits</option>
                  <option value="BRANDY">Brandy</option>
                </>
              ) : (
                <>
                  <option value="COMMERCIAL">Commercial Brewery</option>
                  <option value="CRAFT_BREWERY">Craft Brewery</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volume (Liters)
            </label>
            <input
              type="number"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              step="0.001"
              min="0"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alcohol Content (%)
            </label>
            <input
              type="number"
              name="alcoholContent"
              value={formData.alcoholContent}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="100"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Period Start
            </label>
            <div className="relative">
              <input
                type="date"
                name="periodStart"
                value={formData.periodStart}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Period End
            </label>
            <div className="relative">
              <input
                type="date"
                name="periodEnd"
                value={formData.periodEnd}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Calculate Excise Duty
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExciseCalculator;