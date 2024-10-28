import React, { useState } from 'react';
import { Trash2, AlertTriangle, ShoppingBag } from 'lucide-react';
import ShopifySetup from '../components/sales/ShopifySetup';

function Settings() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showShopifySetup, setShowShopifySetup] = useState(false);

  const handleClearData = async () => {
    setIsClearing(true);
    try {
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error('Error clearing data:', error);
    } finally {
      setIsClearing(false);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Integration Management */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Integration Management</h2>
        
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-900">Shopify Integration</h3>
              <p className="mt-1 text-sm text-gray-500">
                Connect your Shopify store to sync online sales data
              </p>
            </div>
            <button
              onClick={() => setShowShopifySetup(true)}
              className="flex items-center px-4 py-2 bg-[#96bf47] text-white rounded-lg hover:bg-[#85ab3f]"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Configure Shopify
            </button>
          </div>
        </div>

        {showShopifySetup && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <ShopifySetup
              onSave={(config) => {
                localStorage.setItem('shopifyConfig', JSON.stringify(config));
                setShowShopifySetup(false);
              }}
              initialConfig={JSON.parse(localStorage.getItem('shopifyConfig') || '{}')}
            />
          </div>
        )}
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Data Management</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-900">Clear Test Data</h3>
              <p className="mt-1 text-sm text-gray-500">
                Remove all test data and reset the application to its initial state. 
                This action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowConfirmation(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              disabled={isClearing}
            >
              <Trash2 className="w-5 h-5 mr-2" />
              {isClearing ? 'Clearing...' : 'Clear Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                Are you sure?
              </h3>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              This will permanently remove all test data, including:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Production batches</li>
                <li>Inventory items</li>
                <li>Sales records</li>
                <li>Quality control data</li>
                <li>Settings and preferences</li>
              </ul>
            </p>

            <p className="text-sm font-medium text-red-600 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={isClearing}
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                disabled={isClearing}
              >
                {isClearing ? 'Clearing...' : 'Yes, Clear All Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;