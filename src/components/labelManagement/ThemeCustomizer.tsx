import React, { useState } from 'react';
import { Theme } from '../../types/labelManagement';

interface ThemeCustomizerProps {
  initialTheme?: Theme;
  onSave: (theme: Partial<Theme>) => void;
}

function ThemeCustomizer({ initialTheme, onSave }: ThemeCustomizerProps) {
  const [theme, setTheme] = useState<Partial<Theme>>(initialTheme || {
    colors: {
      primary: '#4f46e5',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#111827',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    terminology: {},
  });

  const handleColorChange = (key: string, value: string) => {
    setTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value,
      },
    }));
  };

  const handleFontChange = (key: string, value: string) => {
    setTheme(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [key]: value,
      },
    }));
  };

  const handleTerminologyChange = (key: string, value: string) => {
    setTheme(prev => ({
      ...prev,
      terminology: {
        ...prev.terminology,
        [key]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(theme);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Brand Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(theme.colors || {}).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="h-10 w-10 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Typography</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(theme.fonts || {}).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {key.charAt(0).toUpperCase() + key.slice(1)} Font
              </label>
              <select
                value={value}
                onChange={(e) => handleFontChange(key, e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Custom Terminology</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => handleTerminologyChange(`term_${Date.now()}`, '')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Term
            </button>
          </div>
          {Object.entries(theme.terminology || {}).map(([key, value]) => (
            <div key={key} className="flex space-x-4">
              <input
                type="text"
                value={key.replace('term_', '')}
                onChange={(e) => {
                  const newKey = `term_${e.target.value}`;
                  const newTerminology = { ...theme.terminology };
                  delete newTerminology[key];
                  newTerminology[newKey] = value;
                  setTheme(prev => ({
                    ...prev,
                    terminology: newTerminology,
                  }));
                }}
                placeholder="Original term"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => handleTerminologyChange(key, e.target.value)}
                placeholder="Custom term"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => {
                  const newTerminology = { ...theme.terminology };
                  delete newTerminology[key];
                  setTheme(prev => ({
                    ...prev,
                    terminology: newTerminology,
                  }));
                }}
                className="px-3 py-2 text-red-600 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Save Theme
        </button>
      </div>
    </form>
  );
}

export default ThemeCustomizer;