import React, { useState } from 'react';
import { ShoppingBag, AlertCircle, Check } from 'lucide-react';
import { ShopifyConfig, testShopifyConnection } from '../../services/shopify';

interface ShopifySetupProps {
  onSave: (config: ShopifyConfig) => void;
  initialConfig?: ShopifyConfig;
}

function ShopifySetup({ onSave, initialConfig }: ShopifySetupProps) {
  const [config, setConfig] = useState<ShopifyConfig>({
    shopDomain: initialConfig?.shopDomain || '',
    accessToken: initialConfig?.accessToken || '',
  });
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTesting(true);
    setTestSuccess(false);

    try {
      // Validate shop domain format
      if (!config.shopDomain.includes('.myshopify.com')) {
        throw new Error('Invalid shop domain. Please use your .myshopify.com domain');
      }

      // Test the connection
      const isConnected = await testShopifyConnection(config);
      if (!isConnected) {
        throw new Error('Failed to connect to Shopify. Please check your credentials.');
      }

      setTestSuccess(true);
      onSave(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-green-50 rounded-lg">
          <ShoppingBag className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="ml-3 text-lg font-medium text-gray-900">Shopify Integration</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="text-sm text-blue-800">
          <div className="mb-2">To integrate with Shopify, you'll need:</div>
          <ul className="list-disc list-inside space-y-1">
            <li>Your Shopify store domain (.myshopify.com)</li>
            <li>A custom app access token with orders and products access</li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shop Domain
          </label>
          <input
            type="text"
            value={config.shopDomain}
            onChange={(e) => setConfig(prev => ({ ...prev, shopDomain: e.target.value }))}
            placeholder="your-store.myshopify.com"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Access Token
          </label>
          <input
            type="password"
            value={config.accessToken}
            onChange={(e) => setConfig(prev => ({ ...prev, accessToken: e.target.value }))}
            placeholder="shpat_xxxxx..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <div className="mt-1 text-sm text-gray-500">
            Generate this token in your Shopify admin under Apps {'>'} Develop apps
          </div>
        </div>

        {error && (
          <div className="flex items-center p-4 bg-red-50 rounded-lg text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {testSuccess && (
          <div className="flex items-center p-4 bg-green-50 rounded-lg text-green-600">
            <Check className="w-5 h-5 mr-2" />
            Successfully connected to Shopify!
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={testing}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            {testing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Testing Connection...
              </>
            ) : (
              'Save Configuration'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ShopifySetup;