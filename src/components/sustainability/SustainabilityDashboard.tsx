import React from 'react';
import { Droplets, Zap, Trash2, LeafyGreen } from 'lucide-react';
import { ResourceConsumption, WasteRecord, CarbonEmission, SustainabilityGoal } from '../../types/sustainability';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface SustainabilityMetrics {
  waterUsage: number;
  energyConsumption: number;
  wasteGeneration: number;
  carbonFootprint: number;
  waterReductionTarget: number;
  energyReductionTarget: number;
  wasteReductionTarget: number;
  carbonReductionTarget: number;
}

interface SustainabilityDashboardProps {
  metrics: SustainabilityMetrics;
  resourceData: ResourceConsumption[];
  wasteData: WasteRecord[];
  emissionsData: CarbonEmission[];
  goals: SustainabilityGoal[];
}

function SustainabilityDashboard({
  metrics,
  resourceData,
  wasteData,
  emissionsData,
  goals,
}: SustainabilityDashboardProps) {
  // Calculate trend data
  const trendData = resourceData.reduce((acc: any[], record) => {
    const date = new Date(record.date).toLocaleDateString('default', { month: 'short' });
    const existing = acc.find(item => item.date === date);
    
    if (existing) {
      existing[record.resourceType] = (existing[record.resourceType] || 0) + record.amount;
    } else {
      acc.push({
        date,
        [record.resourceType]: record.amount,
      });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Water Usage</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {metrics.waterUsage.toLocaleString()} L
            </p>
            <div className="mt-1 flex items-center">
              <span className={`text-sm ${
                metrics.waterUsage <= metrics.waterReductionTarget
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {((metrics.waterUsage / metrics.waterReductionTarget - 1) * 100).toFixed(1)}% vs target
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Energy Usage</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {metrics.energyConsumption.toLocaleString()} kWh
            </p>
            <div className="mt-1 flex items-center">
              <span className={`text-sm ${
                metrics.energyConsumption <= metrics.energyReductionTarget
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {((metrics.energyConsumption / metrics.energyReductionTarget - 1) * 100).toFixed(1)}% vs target
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-lg">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Waste Generated</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {metrics.wasteGeneration.toLocaleString()} kg
            </p>
            <div className="mt-1 flex items-center">
              <span className={`text-sm ${
                metrics.wasteGeneration <= metrics.wasteReductionTarget
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {((metrics.wasteGeneration / metrics.wasteReductionTarget - 1) * 100).toFixed(1)}% vs target
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <LeafyGreen className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Carbon Footprint</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {metrics.carbonFootprint.toLocaleString()} tCO₂e
            </p>
            <div className="mt-1 flex items-center">
              <span className={`text-sm ${
                metrics.carbonFootprint <= metrics.carbonReductionTarget
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {((metrics.carbonFootprint / metrics.carbonReductionTarget - 1) * 100).toFixed(1)}% vs target
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Usage Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Resource Consumption Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Water"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Electricity"
                  stroke="#eab308"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Natural Gas"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Sustainability Goals</h3>
          <div className="space-y-4">
            {goals.map(goal => (
              <div
                key={goal.id}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{goal.name}</h4>
                    <p className="text-sm text-gray-500">{goal.category}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    goal.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    goal.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    goal.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {goal.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 rounded-full h-2"
                    style={{
                      width: `${Math.min(
                        (goal.currentValue / goal.targetValue) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Current: {goal.currentValue} {goal.unit}</span>
                  <span>Target: {goal.targetValue} {goal.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SustainabilityDashboard;