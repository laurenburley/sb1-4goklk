import React, { useState } from 'react';
import { Eye, Wind, Coffee, Clock } from 'lucide-react';
import { SensoryAttribute, SensoryCategory, TastingSession } from '../../types/sensory';
import FlavorWheel from './FlavorWheel';

interface TastingFormProps {
  attributes: SensoryAttribute[];
  onSubmit: (data: Partial<TastingSession>) => void;
  onCancel: () => void;
  initialData?: TastingSession;
  tasterId: string;
}

function TastingForm({ attributes, onSubmit, onCancel, initialData, tasterId }: TastingFormProps) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [overallComments, setOverallComments] = useState('');

  const getCategoryIcon = (category: keyof typeof SensoryCategory) => {
    switch (category) {
      case 'APPEARANCE':
        return Eye;
      case 'AROMA':
        return Wind;
      case 'TASTE':
        return Coffee;
      case 'FINISH':
        return Clock;
      default:
        return Eye;
    }
  };

  const handleScoreChange = (attributeId: string, score: number) => {
    setScores(prev => ({ ...prev, [attributeId]: score }));
  };

  const handleNotesChange = (attributeId: string, note: string) => {
    setNotes(prev => ({ ...prev, [attributeId]: note }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const attributeScores = Object.entries(scores).map(([attributeId, score]) => ({
      attributeId,
      score,
      notes: notes[attributeId],
    }));

    const overallScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / 
      Object.values(scores).length;

    onSubmit({
      scores: [{
        tasterId,
        attributes: attributeScores,
        overallScore,
        comments: overallComments,
      }],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flavor Wheel */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Sensory Profile</h3>
          <FlavorWheel
            attributes={attributes}
            scores={scores}
          />
        </div>

        {/* Scoring Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Evaluation</h3>
          <div className="space-y-6">
            {Object.values(SensoryCategory).map(category => {
              const categoryAttributes = attributes.filter(attr => attr.category === category);
              const Icon = getCategoryIcon(category as keyof typeof SensoryCategory);

              return (
                <div key={category}>
                  <div className="flex items-center mb-4">
                    <Icon className="w-5 h-5 text-gray-400 mr-2" />
                    <h4 className="text-base font-medium text-gray-900">{category}</h4>
                  </div>
                  <div className="space-y-4">
                    {categoryAttributes.map(attribute => (
                      <div key={attribute.id}>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">
                            {attribute.name}
                          </label>
                          <span className="text-sm text-gray-500">
                            Score: {scores[attribute.id] || 0}/{attribute.maxScore}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={attribute.minScore}
                          max={attribute.maxScore}
                          step="0.5"
                          value={scores[attribute.id] || 0}
                          onChange={(e) => handleScoreChange(attribute.id, parseFloat(e.target.value))}
                          className="w-full"
                        />
                        <textarea
                          value={notes[attribute.id] || ''}
                          onChange={(e) => handleNotesChange(attribute.id, e.target.value)}
                          placeholder="Notes (optional)"
                          rows={2}
                          className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Overall Comments</h3>
        <textarea
          value={overallComments}
          onChange={(e) => setOverallComments(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter any overall comments or observations..."
        />
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
          Submit Evaluation
        </button>
      </div>
    </form>
  );
}

export default TastingForm;