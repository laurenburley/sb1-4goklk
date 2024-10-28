import React from 'react';
import { DollarSign, TrendingUp, BarChart2, AlertTriangle } from 'lucide-react';
import { ProfitabilityData } from '../../types/costAnalysis';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface CostAnalysisMetrics {
  totalRevenue: number;
  averageMargin: number;
  costEfficiency: number;
  profitTrend: number;
}

interface CostAnalysisDashboardProps {
  metrics: CostAnalysisMetrics;
  profitabilityData: ProfitabilityData[];
}

function CostAnalysisDashboard({ metrics, profitabilityData }: CostAnalysisDashboardProps) {
  // Calculate trend data
  const trendData = profitabilityData.map(data => ({
    batch: data.batchNumber,
    revenue: data.revenue,
    costs: data.totalCosts,
    profit: data.netProfit,
    margin: (data.netMargin * 100).toFixed(1),
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Total Revenue</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              ${metrics.totalRevenue.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-gray-500">Last 30 days</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Average Margin</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {metrics.averageMargin.toFixed(1)}%
            </p>
            <p className="mt-1 text-sm text-gray-500">Across all products</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <BarChart2 className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Cost Efficiency</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {metrics.costEfficiency.toFixed(1)}%
            </p>
            <p className="mt-1 text-sm text-gray-500">vs. target costs</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Profit Trend</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {metrics.profitTrend >= 0 ? '+' : ''}{metrics.profitTrend.toFixed(1)}%
            </p>
            <p className="mt-1 text-sm text-gray-500">Month over month</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Revenue vs. Costs</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="batch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#4f46e5" name="Revenue" />
                <Bar dataKey="costs" fill="#ef4444" name="Costs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Profit Margin Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="batch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="margin"
                  stroke="#10b981"
                  name="Margin %"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Batches */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Batch Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Profit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yield
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profitabilityData.map((data) => (
                <tr key={data.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {data.batchNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${data.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${data.totalCosts.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      data.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${data.netProfit.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      data.netMargin >= 0.2 ? 'bg-green-100 text-green-800' :
                      data.netMargin >= 0.1 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {(data.netMargin * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(data.yieldEfficiency * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CostAnalysisDashboard;