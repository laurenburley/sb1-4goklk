import React, { useState } from 'react';
import { Search, RefreshCw, AlertCircle } from 'lucide-react';
import { hubspotService, HubSpotContact } from '../../services/hubspot';

interface ContactSyncProps {
  onSyncComplete?: () => void;
}

function ContactSync({ onSyncComplete }: ContactSyncProps) {
  const [searchEmail, setSearchEmail] = useState('');
  const [contact, setContact] = useState<HubSpotContact | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSearch = async () => {
    if (!searchEmail) return;
    setError(null);
    setContact(null);

    try {
      const result = await hubspotService.getContact(searchEmail);
      setContact(result);
      if (!result) {
        setError('Contact not found in HubSpot');
      }
    } catch (err) {
      setError('Failed to fetch contact from HubSpot');
    }
  };

  const handleSync = async () => {
    if (!contact) return;
    setError(null);
    setIsSyncing(true);

    try {
      await hubspotService.syncContact(contact);
      onSyncComplete?.();
    } catch (err) {
      setError('Failed to sync contact with HubSpot');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="email"
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Search
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-lg flex items-center text-red-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {contact && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-medium text-gray-900">Contact Details</h3>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Contact'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">
                {contact.firstname} {contact.lastname}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{contact.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{contact.phone || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="font-medium">{contact.company || '-'}</p>
            </div>
            {contact.preferredSpirits && (
              <div>
                <p className="text-sm text-gray-500">Preferred Spirits</p>
                <p className="font-medium">
                  {contact.preferredSpirits.join(', ')}
                </p>
              </div>
            )}
            {contact.lastVisit && (
              <div>
                <p className="text-sm text-gray-500">Last Visit</p>
                <p className="font-medium">
                  {new Date(contact.lastVisit).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {contact.tastingNotes && (
            <div className="mt-6">
              <p className="text-sm text-gray-500">Tasting Notes</p>
              <p className="mt-1">{contact.tastingNotes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ContactSync;