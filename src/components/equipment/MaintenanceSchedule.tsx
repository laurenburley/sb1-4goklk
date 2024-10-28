import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, User } from 'lucide-react';
import { MaintenanceSchedule, MaintenancePriority, Equipment } from '../../types/equipment';

interface MaintenanceScheduleProps {
  schedules: MaintenanceSchedule[];
  equipment: Equipment[];
  onScheduleClick: (schedule: MaintenanceSchedule) => void;
  onNewSchedule: () => void;
}

function MaintenanceSchedule({
  schedules,
  equipment,
  onScheduleClick,
  onNewSchedule,
}: MaintenanceScheduleProps) {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getEquipmentName = (equipmentId: string) => {
    return equipment.find(e => e.id === equipmentId)?.name || 'Unknown Equipment';
  };

  const getDueTasks = (date: Date) => {
    return schedules.filter(schedule => {
      const dueDate = new Date(schedule.nextDue);
      return (
        dueDate.getFullYear() === date.getFullYear() &&
        dueDate.getMonth() === date.getMonth() &&
        dueDate.getDate() === date.getDate()
      );
    });
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendarView = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const weeks = Math.ceil((daysInMonth + firstDay) / 7);

    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ←
            </button>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}

          {Array.from({ length: weeks * 7 }).map((_, index) => {
            const day = index - firstDay + 1;
            const isCurrentMonth = day > 0 && day <= daysInMonth;
            const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
            const tasks = isCurrentMonth ? getDueTasks(date) : [];

            return (
              <div
                key={index}
                className={`min-h-[100px] bg-white p-2 ${
                  isCurrentMonth ? '' : 'bg-gray-50'
                }`}
              >
                {isCurrentMonth && (
                  <>
                    <p className="text-sm font-medium text-gray-900">{day}</p>
                    <div className="mt-1 space-y-1">
                      {tasks.map(task => (
                        <button
                          key={task.id}
                          onClick={() => onScheduleClick(task)}
                          className={`w-full text-left px-2 py-1 rounded text-xs font-medium ${
                            task.priority === MaintenancePriority.CRITICAL ? 'bg-red-100 text-red-800' :
                            task.priority === MaintenancePriority.HIGH ? 'bg-yellow-100 text-yellow-800' :
                            task.priority === MaintenancePriority.MEDIUM ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {getEquipmentName(task.equipmentId)}
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
  };

  const renderListView = () => {
    return (
      <div className="space-y-4">
        {schedules
          .sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())
          .map(schedule => (
            <div
              key={schedule.id}
              onClick={() => onScheduleClick(schedule)}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{schedule.taskName}</h4>
                  <p className="text-sm text-gray-500">
                    {getEquipmentName(schedule.equipmentId)}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  schedule.priority === MaintenancePriority.CRITICAL ? 'bg-red-100 text-red-800' :
                  schedule.priority === MaintenancePriority.HIGH ? 'bg-yellow-100 text-yellow-800' :
                  schedule.priority === MaintenancePriority.MEDIUM ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {schedule.priority}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  Due: {new Date(schedule.nextDue).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  Duration: {schedule.estimatedDuration}h
                </div>
              </div>

              {schedule.assignedTo.length > 0 && (
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <User className="w-4 h-4 mr-2" />
                  Assigned: {schedule.assignedTo.join(', ')}
                </div>
              )}
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Maintenance Schedule</h2>
        <div className="flex space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-md ${
                view === 'calendar' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md ${
                view === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              List
            </button>
          </div>
          <button
            onClick={onNewSchedule}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Schedule Maintenance
          </button>
        </div>
      </div>

      {view === 'calendar' ? renderCalendarView() : renderListView()}
    </div>
  );
}

export default MaintenanceSchedule;