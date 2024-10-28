import React, { useState } from 'react';
import { FileText, Upload, FolderOpen, Search, Calendar, Download, Trash2 } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  category: string;
}

const DOCUMENT_CATEGORIES = {
  EXCISE: 'Excise Returns',
  PSP: 'PSP Statements',
  REMISSION: 'Remission Claims',
  STOCK: 'Stock Records',
  PRODUCTION: 'Production Records',
  LICENSES: 'Licenses & Permits',
  OTHER: 'Other Documents',
};

// Mock data - replace with actual API calls
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Excise Return March 2024.pdf',
    type: 'PDF',
    date: '2024-03-15',
    size: '1.2 MB',
    category: 'EXCISE',
  },
  {
    id: '2',
    name: 'Production Records Q1 2024.xlsx',
    type: 'XLSX',
    date: '2024-03-31',
    size: '856 KB',
    category: 'PRODUCTION',
  },
];

function DocumentManager() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, implement file upload to server
      const newDoc: Document = {
        id: Date.now().toString(),
        name: files[0].name,
        type: files[0].name.split('.').pop()?.toUpperCase() || 'Unknown',
        date: new Date().toISOString().split('T')[0],
        size: `${(files[0].size / 1024 / 1024).toFixed(2)} MB`,
        category: filterCategory || 'OTHER',
      };
      setDocuments([...documents, newDoc]);
    }
  };

  const handleDelete = (id: string) => {
    // In a real app, implement server-side deletion
    setDocuments(documents.filter(doc => doc.id !== id));
    setSelectedDocument(null);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <FolderOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">ATO Document Management</h3>
          </div>
          <div className="flex space-x-4">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer flex items-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            {Object.entries(DOCUMENT_CATEGORIES).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => setSelectedDocument(doc)}
                  className={`hover:bg-gray-50 cursor-pointer ${selectedDocument?.id === doc.id ? 'bg-indigo-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {DOCUMENT_CATEGORIES[doc.category as keyof typeof DOCUMENT_CATEGORIES]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doc.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Implement download functionality
                        console.log('Download:', doc.name);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc.id);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No documents found
          </div>
        )}
      </div>

      {selectedDocument && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Document Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{selectedDocument.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium">
                {DOCUMENT_CATEGORIES[selectedDocument.category as keyof typeof DOCUMENT_CATEGORIES]}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{new Date(selectedDocument.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Size</p>
              <p className="font-medium">{selectedDocument.size}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentManager;