import React, { useState } from 'react';
import { Search, Filter, Clock, Tool } from 'lucide-react';
import { WorkOrder, WorkOrderStatus, MaintenancePriority, Equipment } from '../../types/equipment';

interface WorkOrderListProps {
  workOrders: WorkOrder[];
  equipment: Equipment[];
  onWorkOrderClick: (workOrder: WorkOrder) => void;
}

function WorkOrderList({ workOrders, equipment, onWorkOrderClick }: WorkOrderListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');

  const getEquipmentName = (equipmentId: string) => {
    return equipment.find(e => e.id === equipmentId)?.name || 'Unknown Equipment';
  };

  const filteredWorkOrders = workOrders.filter(order => {
    const matchesSearch = 
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getEquipmentName(order.equipmentId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || order.status === filterStatus;
    const matchesPriority = !filterPriority || order.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search work orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Status</option>
            {Object.values(WorkOrderStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Priorities</option>
            {Object.values(MaintenancePriority).map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredWorkOrders.map((order) => (
          <div
            key={order.id}
            onClick={() => onWorkOrderClick(order)}
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{order.title}</h4>
                <p className="text-sm text-gray-500">
                  {getEquipmentName(order.equipmentId)}
                </p>
              </div>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  order.priority === MaintenancePriority.CRITICAL ? 'bg-red-100 text-red-800' :
                  order.priority === MaintenancePriority.HIGH ? 'bg-yellow-100 text-yellow-800' :
                  order.priority === MaintenancePriority.MEDIUM ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.priority}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  order.status === WorkOrderStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                  order.status === WorkOrderStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                  order.status === WorkOrderStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                Due: {new Date(order.dueDate).toLocaleDateString()}
              </div>
              {order.laborHours && (
                <div className="flex items-center text-sm text-gray-500">
                  <Tool className="w-4 h-4 mr-2" />
                  Labor: {order.laborHours}h
                </div>
              )}
            </div>

            {order.assignedTo.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {order.assignedTo.map((person, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    {person}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkOrderList;