import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Production from '../pages/Production';
import Inventory from '../pages/Inventory';
import Sales from '../pages/Sales';
import Compliance from '../pages/Compliance';
import QualityControl from '../pages/QualityControl';
import ProductionSchedule from '../pages/ProductionSchedule';
import Recipes from '../pages/Recipes';
import Settings from '../pages/Settings';
import ResearchDevelopment from '../pages/ResearchDevelopment';

function MainContent() {
  return (
    <main className="flex-1 p-6">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/production" element={<Production />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/quality-control" element={<QualityControl />} />
        <Route path="/production-schedule" element={<ProductionSchedule />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/research-development" element={<ResearchDevelopment />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </main>
  );
}

export default MainContent;