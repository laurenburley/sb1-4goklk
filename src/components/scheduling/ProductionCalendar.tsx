import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductionRun, ProductionStatus } from '../../types/scheduling';

interface ProductionCalendarProps {
  productionRuns: ProductionRun[];
  onRunClick: (run: ProductionRun) => void;
  onRunUpdate: (runId: string, updates: Partial<ProductionRun>) => void;
}

function ProductionCalendar({ productionRuns, onRunClick, onRunUpdate }: ProductionCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const weeks = Math.ceil((daysInMonth + firstDayOfMonth) / 7);

  const getRunsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return productionRuns.filter(run => {
      const startDate = new Date(run.startDate);
      const endDate = new Date(run.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getStatusColor = (status: keyof typeof ProductionStatus) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'DELAYED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: weeks * 7 }).map((_, index) => {
          const day = index - firstDayOfMonth + 1;
          const isCurrentMonth = day > 0 && day <= daysInMonth;
          const runs = isCurrentMonth ? getRunsForDay(day) : [];

          return (
            <div
              key={index}
              className={`min-h-[120px] bg-white p-2 ${
                isCurrentMonth ? '' : 'bg-gray-50'
              }`}
            >
              {isCurrentMonth && (
                <>
                  <p className="text-sm font-medium text-gray-900">{day}</p>
                  <div className="mt-1 space-y-1">
                    {runs.map(run => (
                      <button
                        key={run.id}
                        onClick={() => onRunClick(run)}
                        className={`w-full text-left px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          run.status as keyof typeof ProductionStatus
                        )}`}
                      >
                        <div className="truncate">{run.recipe.name}</div>
                        <div className="text-xs opacity-75">
                          {run.batchNumber}
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductionCalendar;