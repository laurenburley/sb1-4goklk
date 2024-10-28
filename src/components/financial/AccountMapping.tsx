import React, { useState, useEffect } from 'react';
import { AlertCircle, Save } from 'lucide-react';
import { xeroService, XeroAccount } from '../../services/xero';

interface AccountMapping {
  distilleryAccount: string;
  xeroAccount: string;
}

const DISTILLERY_ACCOUNTS = {
  SALES: 'Sales Revenue',
  EXCISE: 'Excise Tax Payable',
  INVENTORY: 'Inventory Asset',
  PRODUCTION: 'Production Costs',
  EQUIPMENT: 'Equipment Asset',
  UTILITIES: 'Utilities Expense',
  PACKAGING: 'Packaging Materials',
  MARKETING: 'Marketing Expense',
};

function AccountMapping() {
  const [xeroAccounts, setXeroAccounts] = useState<XeroAccount[]>([]);
  const [mappings, setMappings] = useState<AccountMapping[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadXeroAccounts();
  }, []);

  const loadXeroAccounts = async () => {
    try {
      const accounts = await xeroService.getAccounts();
      setXeroAccounts(accounts);
      
      // Initialize mappings
      const initialMappings = Object.keys(DISTILLERY_ACCOUNTS).map(key => ({
        distilleryAccount: DISTILLERY_ACCOUNTS[key as keyof typeof DISTILLERY_ACCOUNTS],
        xeroAccount: '',
      }));
      setMappings(initialMappings);
    } catch (err) {
      setError('Failed to load Xero accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMappingChange = (distilleryAccount: string, xeroAccountId: string) => {
    setMappings(prev => prev.map(mapping => 
      mapping.distilleryAccount === distilleryAccount
        ? { ...mapping, xeroAccount: xeroAccountId }
        : mapping
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // In a real app, save mappings to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Implement saving logic here
    } catch (err) {
      setError('Failed to save account mappings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading accounts...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 rounded-lg flex items-center text-red-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Account Mapping</h3>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Mappings'}
          </button>
        </div>

        <div className="space-y-4">
          {mappings.map((mapping) => (
            <div
              key={mapping.distilleryAccount}
              className="grid grid-cols-2 gap-4 items-center"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {mapping.distilleryAccount}
                </label>
              </div>
              <div>
                <select
                  value={mapping.xeroAccount}
                  onChange={(e) => handleMappingChange(mapping.distilleryAccount, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Xero Account</option>
                  {xeroAccounts.map((account) => (
                    <option key={account.accountID} value={account.accountID}>
                      {account.name} ({account.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Need to create new accounts?</h4>
        <p className="text-sm text-blue-600">
          If you need to create new accounts in Xero for specific distillery operations,
          you can do so directly in Xero or contact your accountant for assistance.
        </p>
      </div>
    </div>
  );
}

export default AccountMapping;