import React from 'react';
import { Eye, Wind, Coffee, Clock } from 'lucide-react';
import { TastingSession, SensoryAttribute } from '../../types/sensory';
import FlavorWheel from './FlavorWheel';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

interface SensoryDashboardProps {
  recentSessions: TastingSession[];
  attributes: SensoryAttribute[];
  onSessionClick?: (session: TastingSession) => void;
}

function SensoryDashboard({ recentSessions, attributes, onSessionClick }: SensoryDashboardProps) {
  // Calculate average scores across all sessions
  const averageScores = attributes.reduce((acc, attr) => {
    const scores = recentSessions.flatMap(session =>
      session.scores.map(score =>
        score.attributes.find(a => a.attributeId === attr.id)?.score || 0
      )
    );
    acc[attr.id] = scores.reduce((sum, score) => sum + score, 0) / scores.length || 0;
    return acc;
  }, {} as Record<string, number>);

  // Prepare data for radar chart
  const radarData = attributes.map(attr => ({
    attribute: attr.name,
    score: averageScores[attr.id],
    fullMark: attr.maxScore,
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-lg">
              <Eye className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Appearance</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">4.5</p>
            <p className="mt-1 text-sm text-gray-500">Average Score</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Wind className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Aroma</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">4.2</p>
            <p className="mt-1 text-sm text-gray-500">Average Score</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <Coffee className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Taste</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">4.7</p>
            <p className="mt-1 text-sm text-gray-500">Average Score</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Finish</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">4.4</p>
            <p className="mt-1 text-sm text-gray-500">Average Score</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Flavor Profile</h3>
          <FlavorWheel
            attributes={attributes}
            scores={averageScores}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Sensory Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="attribute" />
                <Radar
                  name="Average Score"
                  dataKey="score"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Tasting Sessions</h3>
        <div className="space-y-4">
          {recentSessions.map(session => (
            <button
              key={session.id}
              onClick={() => onSessionClick?.(session)}
              className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {session.spiritType} - Batch {session.batchNumber}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(session.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {session.tasters.length} Tasters
                  </p>
                  <p className="text-xs text-gray-500">
                    {session.blindTasting ? 'Blind Tasting' : 'Open Tasting'}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SensoryDashboard;