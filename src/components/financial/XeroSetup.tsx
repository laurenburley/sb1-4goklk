import React, { useState, useEffect } from 'react';
import { Check, AlertCircle, ArrowRight } from 'lucide-react';
import { xeroService } from '../../services/xero';

const SETUP_STEPS = [
  'Authentication',
  'Account Mapping',
  'Initial Sync',
  'Verification',
] as const;

type SetupStep = typeof SETUP_STEPS[number];

function XeroSetup() {
  const [currentStep, setCurrentStep] = useState<SetupStep>('Authentication');
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    const configured = xeroService.isConfigured();
    setIsConfigured(configured);

    if (configured) {
      const connectionValid = await xeroService.testConnection();
      if (!connectionValid) {
        setError('Connection test failed. Please reconfigure the integration.');
        setIsConfigured(false);
      }
    }
  };

  const handleAuthClick = () => {
    const clientId = process.env.XERO_CLIENT_ID;
    const redirectUri = process.env.XERO_REDIRECT_URI;
    const scopes = 'accounting.settings accounting.transactions offline_access';
    
    const authUrl = `https://login.xero.com/identity/connect/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scopes}&` +
      `response_type=code&` +
      `state=${Math.random().toString(36).substring(7)}`;

    window.location.href = authUrl;
  };

  const handleAccountMapping = () => {
    // In a real app, implement account mapping UI
    setCurrentStep('Initial Sync');
  };

  const handleInitialSync = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, implement initial data sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep('Verification');
    } catch (err) {
      setError('Failed to sync data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'Authentication':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              Connect your Xero account to enable financial management integration.
            </p>
            <button
              onClick={handleAuthClick}
              className="px-6 py-2 bg-[#13B5EA] text-white rounded-lg hover:bg-[#0FA3D5] transition-colors"
            >
              Connect to Xero
            </button>
          </div>
        );

      case 'Account Mapping':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              Map your distillery accounts to Xero's chart of accounts.
            </p>
            <button
              onClick={handleAccountMapping}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Configure Account Mapping
            </button>
          </div>
        );

      case 'Initial Sync':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              Perform initial data synchronization with Xero.
            </p>
            <button
              onClick={handleInitialSync}
              disabled={isLoading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Syncing...' : 'Start Initial Sync'}
            </button>
          </div>
        );

      case 'Verification':
        return (
          <div className="space-y-4">
            <div className="flex items-center text-green-600">
              <Check className="w-5 h-5 mr-2" />
              <span>Xero integration is now complete!</span>
            </div>
            <p className="text-gray-600">
              Your distillery's financial data is now syncing with Xero.
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

export default XeroSetup;