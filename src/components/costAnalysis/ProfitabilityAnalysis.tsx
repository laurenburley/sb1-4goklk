import React from 'react';
import { DollarSign, TrendingUp, BarChart2, AlertTriangle } from 'lucide-react';
import { ProfitabilityData } from '../../types/costAnalysis';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ProfitabilityAnalysisProps {
  data: ProfitabilityData;
}

const COLORS = ['#4f46e5', '#ef4444', '#10b981', '#f59e0b'];

function ProfitabilityAnalysis({ data }: ProfitabilityAnalysisProps) {
  // Calculate cost breakdown
  const costBreakdown = [
    { name: 'Direct Costs', value: data.directCosts },
    { name: 'Indirect Costs', value: data.indirectCosts },
    { name: 'Excise Tax', value: data.exciseTaxPerUnit * data.unitsProduced },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Net Profit</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              ${data.netProfit.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {(data.netMargin * 100).toFixed(1)}% margin
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Per Unit</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              ${data.profitPerUnit.toFixed(2)}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Profit per unit
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <BarChart2 className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Yield</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {(data.yieldEfficiency * 100).toFixed(1)}%
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Production efficiency
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Excise Tax</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              ${data.exciseTaxPerUnit.toFixed(2)}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Per unit
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Cost Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Selling Price</span>
              <span className="font-medium">${data.averageSellingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cost per Unit</span>
              <span className="font-medium">${data.costPerUnit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Units Produced</span>
              <span className="font-medium">{data.unitsProduced}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Units Sold</span>
              <span className="font-medium">{data.unitsSold}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Gross Margin</span>
              <span className="font-medium">{(data.grossMargin * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Net Margin</span>
              <span className="font-medium">{(data.netMargin * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitabilityAnalysis;