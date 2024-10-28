import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Factory, 
  Package, 
  DollarSign, 
  FileText, 
  TestTube2,
  Calendar,
  BookOpen,
  Settings,
  Beaker
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Production', to: '/production', icon: Factory },
  { name: 'Recipes', to: '/recipes', icon: BookOpen },
  { name: 'R&D', to: '/research-development', icon: Beaker },
  { name: 'Inventory', to: '/inventory', icon: Package },
  { name: 'Compliance', to: '/compliance', icon: FileText },
  { name: 'Sales', to: '/sales', icon: DollarSign },
  { name: 'Quality Control', to: '/quality-control', icon: TestTube2 },
  { name: 'Production Schedule', to: '/production-schedule', icon: Calendar },
  { name: 'Settings', to: '/settings', icon: Settings },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-indigo-600">Distillery Manager</h1>
      </div>
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;