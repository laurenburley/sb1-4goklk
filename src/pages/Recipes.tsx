import React, { useState, useEffect } from 'react';
import { Plus, Grid, List } from 'lucide-react';
import RecipeGrid from '../components/recipes/RecipeGrid';
import RecipeList from '../components/recipes/RecipeList';
import RecipeForm from '../components/recipes/RecipeForm';
import { Recipe, RecipeStatus } from '../types/recipe';
import { useInitialData } from '../context/InitialDataContext';

function Recipes() {
  const { recipes, setRecipes } = useInitialData();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const metrics = {
    totalRecipes: recipes.length,
    activeRecipes: recipes.filter(r => r.status === RecipeStatus.ACTIVE).length,
    experimentalRecipes: recipes.filter(r => r.status === RecipeStatus.EXPERIMENTAL).length,
    averageRating: recipes.reduce((sum, r) => {
      const ratings = r.tastingNotes?.map(n => n.rating) || [];
      return ratings.length ? sum + (ratings.reduce((a, b) => a + b, 0) / ratings.length) : sum;
    }, 0) / (recipes.length || 1),
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: Partial<Recipe>) => {
    try {
      if (selectedRecipe) {
        // Update existing recipe
        const updatedRecipe = {
          ...selectedRecipe,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        const updatedRecipes = recipes.map(recipe => 
          recipe.id === selectedRecipe.id ? updatedRecipe : recipe
        );
        setRecipes(updatedRecipes);
      } else {
        // Create new recipe
        const newRecipe: Recipe = {
          ...data as Recipe,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
          tastingNotes: [],
          createdBy: 'system',
          updatedBy: 'system',
        };
        setRecipes([...recipes, newRecipe]);
      }
      setShowForm(false);
      setSelectedRecipe(null);
    } catch (err) {
      console.error('Error saving recipe:', err);
    }
  };

  return (
    <div className="space-y-8">
      {!showForm ? (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>
            <div className="flex space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Recipe
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Recipes</h3>
              <p className="mt-2 text-3xl font-semibold">{metrics.totalRecipes}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900">Active Recipes</h3>
              <p className="mt-2 text-3xl font-semibold">{metrics.activeRecipes}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900">Experimental</h3>
              <p className="mt-2 text-3xl font-semibold">{metrics.experimentalRecipes}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900">Average Rating</h3>
              <p className="mt-2 text-3xl font-semibold">{metrics.averageRating.toFixed(1)}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Recipe Library</h2>
            {viewMode === 'grid' ? (
              <RecipeGrid
                recipes={recipes}
                onRecipeClick={handleRecipeClick}
              />
            ) : (
              <RecipeList
                recipes={recipes}
                onRecipeClick={handleRecipeClick}
              />
            )}
          </div>
        </>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedRecipe ? 'Edit Recipe' : 'New Recipe'}
          </h1>
          <RecipeForm
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedRecipe(null);
            }}
            initialData={selectedRecipe}
          />
        </div>
      )}
    </div>
  );
}

export default Recipes;