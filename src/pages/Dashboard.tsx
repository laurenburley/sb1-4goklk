import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Beaker,
  Wine,
  Leaf,
  BarChart2,
  ClipboardCheck,
  MoreVertical,
  X
} from 'lucide-react';

function Dashboard() {
  const [hiddenCards, setHiddenCards] = useState<string[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const features = [
    {
      title: 'Production',
      description: 'Manage distillation runs, track batches, and monitor production progress',
      stats: '12 active batches • 2,500L in production',
      icon: Factory,
      link: '/production',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Recipes',
      description: 'Create and manage spirit recipes, ingredients, and production methods',
      stats: '8 active recipes • 3 in development',
      icon: BookOpen,
      link: '/recipes',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Research & Development',
      description: 'Experiment with new recipes and track development progress',
      stats: '4 experiments • 2 pending trials',
      icon: Beaker,
      link: '/research-development',
      color: 'bg-pink-50 text-pink-600',
    },
    {
      title: 'Inventory',
      description: 'Track raw materials, finished products, and supplies',
      stats: '156 items • 12 low stock alerts',
      icon: Package,
      link: '/inventory',
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Barrel Management',
      description: 'Monitor aging spirits, track fills, and manage warehouse locations',
      stats: '85 barrels • 15 ready for bottling',
      icon: Wine,
      link: '/barrel-management',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Sales',
      description: 'Track orders, manage customers, and analyze sales performance',
      stats: '45 orders this month • $45,678 revenue',
      icon: DollarSign,
      link: '/sales',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Compliance',
      description: 'Manage ATO requirements, excise records, and regulatory documentation',
      stats: '2 reports due • $12,345 excise payable',
      icon: FileText,
      link: '/compliance',
      color: 'bg-red-50 text-red-600',
    },
    {
      title: 'Quality Control',
      description: 'Monitor quality standards, conduct tests, and track sample analysis',
      stats: '8 tests pending • 98% pass rate',
      icon: TestTube2,
      link: '/quality-control',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Production Schedule',
      description: 'Plan production runs, allocate resources, and manage timelines',
      stats: '6 runs scheduled • 85% capacity utilization',
      icon: Calendar,
      link: '/production-schedule',
      color: 'bg-cyan-50 text-cyan-600',
    },
    {
      title: 'Sustainability',
      description: 'Track resource usage, manage waste, and monitor environmental impact',
      stats: '15% water reduction • 90% waste diverted',
      icon: Leaf,
      link: '/sustainability',
      color: 'bg-teal-50 text-teal-600',
    },
    {
      title: 'Cost Analysis',
      description: 'Track expenses, analyze profitability, and manage budgets',
      stats: '32% gross margin • $125k monthly costs',
      icon: BarChart2,
      link: '/cost-analysis',
      color: 'bg-violet-50 text-violet-600',
    },
    {
      title: 'Settings',
      description: 'Configure system preferences, integrations, and user settings',
      stats: '3 integrations • Last updated today',
      icon: Settings,
      link: '/settings',
      color: 'bg-gray-50 text-gray-600',
    },
  ];

  const handleRemoveCard = (title: string) => {
    setHiddenCards([...hiddenCards, title]);
    setOpenMenu(null);
  };

  const handleRestoreAll = () => {
    setHiddenCards([]);
  };

  const visibleFeatures = features.filter(feature => !hiddenCards.includes(feature.title));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          {hiddenCards.length > 0 && (
            <button
              onClick={handleRestoreAll}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Restore All Cards
            </button>
          )}
          <span className="text-sm text-gray-500">
            Welcome to your distillery management system
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow relative group"
            >
              <Link to={feature.link} className="block">
                <div className="flex items-center mb-4">
                  <div className={`p-2 rounded-lg ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {feature.description}
                </p>
                <p className="text-sm font-medium text-gray-600">
                  {feature.stats}
                </p>
              </Link>
              
              <div className="absolute top-4 right-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenMenu(openMenu === feature.title ? null : feature.title);
                  }}
                  className="p-1 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>
                
                {openMenu === feature.title && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveCard(feature.title);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Remove from dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Factory className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Production Volume</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">2,500L</p>
            <p className="mt-1 text-sm text-gray-500">
              <span className="text-green-600">↑ 12%</span> from last month
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <ClipboardCheck className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Efficiency Rate</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">94%</p>
            <p className="mt-1 text-sm text-gray-500">
              <span className="text-green-600">↑ 5%</span> from last month
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-amber-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Revenue</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">$45,678</p>
            <p className="mt-1 text-sm text-gray-500">
              <span className="text-green-600">↑ 8%</span> from last month
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-50 rounded-lg">
              <TestTube2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Quality Score</h3>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-gray-900">98%</p>
            <p className="mt-1 text-sm text-gray-500">
              <span className="text-green-600">↑ 2%</span> from last month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;