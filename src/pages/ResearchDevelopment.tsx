import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import RDDashboard from '../components/researchDevelopment/RDDashboard';
import ExperimentList from '../components/researchDevelopment/ExperimentList';
import ExperimentForm from '../components/researchDevelopment/ExperimentForm';
import { Experiment, ExperimentStatus } from '../types/researchDevelopment';
import { Recipe } from '../types/recipe';
import { useNavigate } from 'react-router-dom';

function ResearchDevelopment() {
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const navigate = useNavigate();

  // Load experiments from localStorage
  React.useEffect(() => {
    const savedExperiments = localStorage.getItem('experiments');
    if (savedExperiments) {
      setExperiments(JSON.parse(savedExperiments));
    }
  }, []);

  const handleExperimentClick = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
    setShowForm(true);
  };

  const handleFormSubmit = (data: Partial<Experiment>) => {
    if (selectedExperiment) {
      // Update existing experiment
      const updatedExperiments = experiments.map(exp =>
        exp.id === selectedExperiment.id
          ? { ...exp, ...data, updatedAt: new Date().toISOString() }
          : exp
      );
      setExperiments(updatedExperiments);
      localStorage.setItem('experiments', JSON.stringify(updatedExperiments));
    } else {
      // Create new experiment
      const newExperiment: Experiment = {
        ...data as Experiment,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedExperiments = [...experiments, newExperiment];
      setExperiments(updatedExperiments);
      localStorage.setItem('experiments', JSON.stringify(updatedExperiments));
    }
    setShowForm(false);
    setSelectedExperiment(null);
  };

  const handleConvertToRecipe = (recipe: Partial<Recipe>) => {
    // Load existing recipes
    const savedRecipes = localStorage.getItem('recipes');
    const recipes = savedRecipes ? JSON.parse(savedRecipes) : [];

    // Create new recipe
    const newRecipe: Recipe = {
      ...recipe as Recipe,
      id: Date.now().toString(),
    };

    // Save updated recipes
    const updatedRecipes = [...recipes, newRecipe];
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));

    // Update experiment status
    if (selectedExperiment) {
      const updatedExperiments = experiments.map(exp =>
        exp.id === selectedExperiment.id
          ? { ...exp, status: ExperimentStatus.COMPLETED, updatedAt: new Date().toISOString() }
          : exp
      );
      setExperiments(updatedExperiments);
      localStorage.setItem('experiments', JSON.stringify(updatedExperiments));
    }

    // Navigate to recipes page
    navigate('/recipes');
  };

  return (
    <div className="space-y-8">
      {!showForm ? (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Research & Development</h1>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Experiment
            </button>
          </div>

          <RDDashboard experiments={experiments} />

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Experiments</h2>
            <ExperimentList
              experiments={experiments}
              onExperimentClick={handleExperimentClick}
            />
          </div>
        </>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedExperiment ? 'Edit Experiment' : 'New Experiment'}
          </h1>
          <ExperimentForm
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedExperiment(null);
            }}
            onConvertToRecipe={handleConvertToRecipe}
            initialData={selectedExperiment}
          />
        </div>
      )}
    </div>
  );
}

export default ResearchDevelopment;