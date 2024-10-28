import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { ProductionBatch, SpiritType } from '../../types/production';

interface ProductionAnalyticsProps {
  batches: ProductionBatch[];
}

function ProductionAnalytics({ batches }: ProductionAnalyticsProps) {
  // Calculate monthly production data
  const monthlyData = batches.reduce((acc: any[], batch) => {
    const date = new Date(batch.productionDate);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    const existingMonth = acc.find(item => item.month === monthYear);
    if (existingMonth) {
      existingMonth.volume += batch.volumeProduced;
      existingMonth[batch.spiritType] = (existingMonth[batch.spiritType] || 0) + batch.volumeProduced;
    } else {
      acc.push({
        month: monthYear,
        volume: batch.volumeProduced,
        [batch.spiritType]: batch.volumeProduced
      });
    }
    return acc;
  }, []);

  // Calculate production by spirit type
  const spiritTypeData = Object.values(SpiritType).map(type => ({
    name: type,
    volume: batches
      .filter(batch => batch.spiritType === type)
      .reduce((sum, batch) => sum + batch.volumeProduced, 0)
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Monthly Production Volume</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="volume" stroke="#4f46e5" name="Total Volume (L)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Production by Spirit Type</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spiritTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="volume" fill="#4f46e5" name="Volume (L)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductionAnalytics;