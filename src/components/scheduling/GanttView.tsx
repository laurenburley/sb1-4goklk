import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductionRun, ProductionStatus } from '../../types/scheduling';

interface GanttViewProps {
  productionRuns: ProductionRun[];
  onRunClick: (run: ProductionRun) => void;
  onRunUpdate: (runId: string, updates: Partial<ProductionRun>) => void;
}

function GanttView({ productionRuns, onRunClick, onRunUpdate }: GanttViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysToShow = 14; // Show 2 weeks by default

  const getDaysBetween = (start: Date, end: Date) => {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: keyof typeof ProductionStatus) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-500';
      case 'IN_PROGRESS':
        return 'bg-green-500';
      case 'COMPLETED':
        return 'bg-gray-500';
      case 'DELAYED':
        return 'bg-yellow-500';
      case 'CANCELLED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Generate dates for the header
  const dates = Array.from({ length: daysToShow }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Production Timeline</h2>
          <div className="flex space-x-4">
            <button
              onClick={handlePrevWeek}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextWeek}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Header */}
          <div className="grid grid-cols-[200px_repeat(14,100px)] border-b border-gray-200">
            <div className="p-4 font-medium text-gray-700">Production Run</div>
            {dates.map((date, index) => (
              <div
                key={index}
                className="p-4 text-center border-l border-gray-200"
              >
                <div className="text-sm font-medium text-gray-700">
                  {date.toLocaleDateString(undefined, { weekday: 'short' })}
                </div>
                <div className="text-xs text-gray-500">
                  {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>

          {/* Production Runs */}
          {productionRuns.map((run) => {
            const startDate = new Date(run.startDate);
            const endDate = new Date(run.endDate);
            const startOffset = Math.max(
              0,
              getDaysBetween(currentDate, startDate)
            );
            const duration = Math.min(
              daysToShow - startOffset,
              getDaysBetween(startDate, endDate) + 1
            );

            return (
              <div
                key={run.id}
                className="grid grid-cols-[200px_repeat(14,100px)] border-b border-gray-200 hover:bg-gray-50"
              >
                <div className="p-4">
                  <div className="font-medium text-gray-900">{run.recipe.name}</div>
                  <div className="text-sm text-gray-500">{run.batchNumber}</div>
                </div>
                <div
                  className="col-span-14 p-2 relative"
                  style={{ gridColumnStart: startOffset + 2 }}
                >
                  <div
                    className={`absolute top-2 h-8 rounded-lg ${getStatusColor(
                      run.status as keyof typeof ProductionStatus
                    )} opacity-80 cursor-pointer transition-opacity hover:opacity-100`}
                    style={{
                      left: '0.5rem',
                      width: `calc(${duration * 100}px - 1rem)`,
                    }}
                    onClick={() => onRunClick(run)}
                  >
                    <div className="px-2 py-1 text-xs font-medium text-white truncate">
                      {run.currentStage}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GanttView;