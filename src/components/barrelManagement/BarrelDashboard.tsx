import React from 'react';
import { BarChart2, Droplet, ThermometerSun, Calendar } from 'lucide-react';
import { Barrel, BarrelStatus } from '../../types/barrelManagement';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface BarrelMetrics {
  totalBarrels: number;
  activeBarrels: number;
  averageAge: number;
  projectedReadyCount: number;
  totalVolume: number;
  angelShare: number;
}

interface BarrelDashboardProps {
  metrics: BarrelMetrics;
  barrels: Barrel[];
}

function BarrelDashboard({ metrics, barrels }: BarrelDashboardProps) {
  // Calculate aging trends
  const agingTrends = barrels
    .filter(barrel => barrel.currentFill)
    .reduce((acc: any[], barrel) => {
      const monthYear = new Date(barrel.currentFill!.fillDate)
        .toLocaleDateString('default', { month: 'short', year: 'numeric' });
      
      const existing = acc.find(item => item.month === monthYear);
      if (existing) {
        existing.volume += barrel.currentFill!.currentVolume;
        existing.count += 1;
      } else {
        acc.push({
          month: monthYear,
          volume: barrel.currentFill!.currentVolume,
          count: 1,
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
            <div className="p-2 bg-amber-50 rounded-lg">
              <BarChart2 className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Active Barrels</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {metrics.activeBarrels}/{metrics.totalBarrels}
            </p>
            <p className="mt-1 text-sm text-gray-500">Currently aging</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Droplet className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Total Volume</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {metrics.totalVolume.toLocaleString()} L
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Angel's share: {metrics.angelShare.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Average Age</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {metrics.averageAge.toFixed(1)} years
            </p>
            <p className="mt-1 text-sm text-gray-500">Across all barrels</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <ThermometerSun className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Ready Soon</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">
              {metrics.projectedReadyCount}
            </p>
            <p className="mt-1 text-sm text-gray-500">Within next 30 days</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Aging Volume Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={agingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#d97706"
                  name="Volume (L)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Barrel Status Distribution</h3>
          <div className="space-y-4">
            {Object.values(BarrelStatus).map(status => {
              const count = barrels.filter(b => b.status === status).length;
              const percentage = (count / metrics.totalBarrels) * 100;
              
              return (
                <div key={status}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600">{status}</span>
                    <span className="text-sm text-gray-500">{count} barrels</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-amber-600 rounded-full h-2"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarrelDashboard;