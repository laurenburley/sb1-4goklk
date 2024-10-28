import React, { useState, useEffect } from 'react';
import { Check, AlertCircle, ArrowRight } from 'lucide-react';
import { hubspotService } from '../../services/hubspot';

const SETUP_STEPS = [
  'Authentication',
  'Field Mapping',
  'Initial Sync',
  'Verification',
] as const;

type SetupStep = typeof SETUP_STEPS[number];

function HubSpotSetup() {
  const [currentStep, setCurrentStep] = useState<SetupStep>('Authentication');
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    const configured = hubspotService.isConfigured();
    setIsConfigured(configured);

    if (configured) {
      const connectionValid = await hubspotService.testConnection();
      if (!connectionValid) {
        setError('Connection test failed. Please reconfigure the integration.');
        setIsConfigured(false);
      }
    }
  };

  const handleAuthClick = () => {
    const clientId = process.env.HUBSPOT_CLIENT_ID;
    const redirectUri = process.env.HUBSPOT_REDIRECT_URI;
    const scopes = 'contacts crm.objects.contacts.write crm.objects.contacts.read';
    
    const authUrl = `https://app.hubspot.com/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scopes}`;

    window.location.href = authUrl;
  };

  const handleFieldMapping = () => {
    // In a real app, implement field mapping UI
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
              Connect your HubSpot account to enable CRM integration.
            </p>
            <button
              onClick={handleAuthClick}
              className="px-6 py-2 bg-[#ff7a59] text-white rounded-lg hover:bg-[#ff8f73] transition-colors"
            >
              Connect to HubSpot
            </button>
          </div>
        );

      case 'Field Mapping':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              Map your distillery data fields to HubSpot contact properties.
            </p>
            <button
              onClick={handleFieldMapping}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Configure Field Mapping
            </button>
          </div>
        );

      case 'Initial Sync':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              Perform initial data synchronization with HubSpot.
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
              <span>HubSpot integration is now complete!</span>
            </div>
            <p className="text-gray-600">
              Your distillery data is now syncing with HubSpot.
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

export default HubSpotSetup;