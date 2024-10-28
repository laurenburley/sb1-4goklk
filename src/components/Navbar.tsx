import React from 'react';
import { Menu, Bell } from 'lucide-react';

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex items-center flex-shrink-0">
              <span className="text-xl font-bold text-indigo-600">Distillery Manager</span>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-1 text-gray-400 rounded-full hover:text-gray-500">
              <Bell className="w-6 h-6" />
            </button>
            <div className="flex items-center ml-4">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600">JD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;