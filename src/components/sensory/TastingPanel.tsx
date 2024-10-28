import React from 'react';
import { Users, Star, Calendar } from 'lucide-react';
import { TastingSession, Taster } from '../../types/sensory';

interface TastingPanelProps {
  session: TastingSession;
  tasters: Taster[];
  onTasterClick?: (taster: Taster) => void;
}

function TastingPanel({ session, tasters, onTasterClick }: TastingPanelProps) {
  const sessionTasters = tasters.filter(taster => 
    session.tasters.includes(taster.id)
  );

  const getAverageScore = (tasterId: string) => {
    const tasterScore = session.scores.find(score => score.tasterId === tasterId);
    if (!tasterScore) return 0;
    return tasterScore.overallScore;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Tasting Panel</h3>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(session.date).toLocaleDateString()}
        </div>
      </div>

      <div className="space-y-6">
        {/* Panel Info */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Users className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900">
              {sessionTasters.length} Tasters
            </span>
          </div>
          <div className="flex items-center">
            <Star className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900">
              {session.blindTasting ? 'Blind Tasting' : 'Open Tasting'}
            </span>
          </div>
        </div>

        {/* Taster List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessionTasters.map(taster => (
            <button
              key={taster.id}
              onClick={() => onTasterClick?.(taster)}
              className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{taster.name}</h4>
                <p className="text-sm text-gray-500">{taster.role}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {getAverageScore(taster.id).toFixed(1)}
                </div>
                <p className="text-xs text-gray-500">Average Score</p>
              </div>
            </button>
          ))}
        </div>

        {/* Consensus Notes */}
        {session.consensusNotes && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Consensus Notes</h4>
            <p className="text-sm text-gray-600">{session.consensusNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TastingPanel;