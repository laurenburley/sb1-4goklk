import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BarrelManagement from './BarrelManagement';

function WhiteLabelBarrelManagement() {
  // Check if white label feature is enabled
  const isWhiteLabelEnabled = localStorage.getItem('whitelabelEnabled') === 'true';

  if (!isWhiteLabelEnabled) {
    return <Navigate to="/settings" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<BarrelManagement />} />
      <Route path="/settings" element={<BarrelManagement />} />
    </Routes>
  );
}

export default WhiteLabelBarrelManagement;