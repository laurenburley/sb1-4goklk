import React, { useState, useEffect } from 'react';
import { Check, AlertCircle, ArrowRight } from 'lucide-react';
import { squareService, SquareConfig } from '../../services/square';

const SETUP_STEPS = [
  'Authentication',
  'Location Setup',
  'Product Sync',
  'Verification',
] as const;

type SetupStep = typeof SETUP_STEPS[number];

function SquareSetup() {
  const [currentStep, setCurrentStep] = useState<SetupStep>('Authentication');
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<Partial<SquareConfig>>({
    environment: 'sandbox',
  });

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    const configured = squareService.isConfigured();
    setIsConfigured(configured);

    if (configured) {
      const connectionValid = await squareService.testConnection();
      if (!connectionValid) {
        setError('Connection test failed. Please reconfigure the integration.');
        setIsConfigured(false);
      }
    }
  };

  const handleAccessTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await squareService.configure(config as SquareConfig);
      setCurrentStep('Location Setup');
    } catch (err) {
      setError('Failed to connect to Square. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSetup = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const location = await squareService.getLocation();
      setConfig(prev => ({
        ...prev,
        locationId: location.id,
      }));
      setCurrentStep('Product Sync');
    } catch (err) {
      setError('Failed to retrieve location information.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSync = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // In a real app, implement initial product sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep('Verification');
    } catch (err) {
      setError('Failed to sync products with Square.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'Authentication':
        return (
          <div className="space-y-6">
            <p className="text-gray-600">
              Connect your Square account to enable POS and payment processing.
            </p>
            <form onSubmit={handleAccessTokenSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Token
                </label>
                <input
                  type="password"
                  value={config.accessToken || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, accessToken: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Environment
                </label>
                <select
                  value={config.environment}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    environment: e.target.value as 'sandbox' | 'production'
                  }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="sandbox">Sandbox</option>
                  <option value="production">Production</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {isLoading ? 'Connecting...' : 'Connect Square Account'}
              </button>
            </form>
          </div>
        );

      case 'Location Setup':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              Configure your Square location settings for the distillery.
            </p>
            <button
              onClick={handleLocationSetup}
              disabled={isLoading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Setting up...' : 'Configure Location'}
            </button>
          </div>
        );

      case 'Product Sync':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              Sync your distillery products with Square's catalog.
            </p>
            <button
              onClick={handleProductSync}
              disabled={isLoading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Syncing...' : 'Start Product Sync'}
            </button>
          </div>
        );

      case 'Verification':
        return (
          <div className="space-y-4">
            <div className="flex items-center text-green-600">
              <Check className="w-5 h-5 mr-2" />
              <span>Square integration is now complete!</span>
            </div>
            <p className="text-gray-600">
              Your distillery is now connected to Square for POS and payment processing.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex justify-between">
        {SETUP_STEPS.map((step, index) => (
          <div
            key={step}
            className="flex items-center"
          >
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full
              ${currentStep === step ? 'bg-indigo-600 text-white' :
                SETUP_STEPS.indexOf(currentStep) > index ? 'bg-green-500 text-white' :
                'bg-gray-200 text-gray-500'}
            `}>
              {SETUP_STEPS.indexOf(currentStep) > index ? (
                <Check className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{step}</p>
            </div>
            {index < SETUP_STEPS.length - 1 && (
              <ArrowRight className="w-5 h-5 mx-4 text-gray-300" />
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          {currentStep}
        </h3>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {renderStepContent()}
      </div>
    </div>
  );
}

export default SquareSetup;