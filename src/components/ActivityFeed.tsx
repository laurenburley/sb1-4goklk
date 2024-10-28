import React from 'react';
import { Activity } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'production' | 'sale' | 'inventory' | 'compliance';
  description: string;
  timestamp: string;
}

const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'production',
    description: 'New batch #1234 started - Single Malt Whiskey',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'sale',
    description: 'Completed sale to Distributor XYZ - $12,450',
    timestamp: '4 hours ago'
  },
  {
    id: '3',
    type: 'inventory',
    description: 'Updated barrel inventory - Added 25 new barrels',
    timestamp: '1 day ago'
  }
];

function ActivityFeed() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-6">
        <Activity className="w-5 h-5 text-indigo-600" />
        <h3 className="ml-2 text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start">
            <div className="w-2 h-2 mt-2 rounded-full bg-indigo-600 mr-3" />
            <div>
              <p className="text-sm text-gray-900">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
        View all activity
      </button>
    </div>
  );
}

export default ActivityFeed;