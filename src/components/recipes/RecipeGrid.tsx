import React from 'react';
import { Star, Clock, Percent } from 'lucide-react';
import { Recipe, RecipeStatus } from '../../types/recipe';

interface RecipeGridProps {
  recipes: Recipe[];
  onRecipeClick: (recipe: Recipe) => void;
}

function RecipeGrid({ recipes, onRecipeClick }: RecipeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          onClick={() => onRecipeClick(recipe)}
          className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{recipe.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{recipe.spiritType}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full
                ${recipe.status === RecipeStatus.ACTIVE ? 'bg-green-100 text-green-800' :
                  recipe.status === RecipeStatus.EXPERIMENTAL ? 'bg-yellow-100 text-yellow-800' :
                  recipe.status === RecipeStatus.ARCHIVED ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'}`}>
                {recipe.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {recipe.description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Target ABV</p>
                <div className="flex items-center mt-1">
                  <Percent className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-sm font-medium">{recipe.targetABV}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Batch Size</p>
                <p className="text-sm font-medium mt-1">
                  {recipe.batchSize} {recipe.batchUnit}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>v{recipe.version}</span>
                </div>
                <div>
                  Updated {new Date(recipe.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecipeGrid;