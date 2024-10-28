import { getData, setData } from '../../db/firebase';
import { Recipe } from '../../types/recipe';

export async function getAllRecipes(): Promise<Recipe[]> {
  try {
    const data = await getData('/recipes');
    return data ? Object.values(data) : [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const recipe = await getData(`/recipes/${id}`);
    if (!recipe) return null;

    const ingredients = await getData(`/recipeIngredients`);
    const recipeIngredients = ingredients ? 
      Object.values(ingredients).filter((ing: any) => ing.recipeId === id) : 
      [];

    return {
      ...recipe,
      ingredients: recipeIngredients,
    };
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
}

export async function createRecipe(recipe: Omit<Recipe, 'id'>): Promise<Recipe> {
  try {
    const id = crypto.randomUUID();
    const { ingredients, ...recipeData } = recipe;

    // First save the recipe
    await setData(`/recipes/${id}`, {
      ...recipeData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Then save ingredients in a transaction-like manner
    if (ingredients?.length) {
      const ingredientPromises = ingredients.map(ingredient => {
        const ingredientId = crypto.randomUUID();
        return setData(`/recipeIngredients/${ingredientId}`, {
          ...ingredient,
          id: ingredientId,
          recipeId: id,
        });
      });
      await Promise.all(ingredientPromises);
    }

    // Fetch the complete recipe with ingredients
    const createdRecipe = await getRecipeById(id);
    if (!createdRecipe) throw new Error('Failed to create recipe');
    return createdRecipe;
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
}

export async function updateRecipe(id: string, recipe: Partial<Recipe>): Promise<Recipe> {
  try {
    const { ingredients, ...recipeData } = recipe;

    // Update recipe data
    await setData(`/recipes/${id}`, {
      ...recipeData,
      updatedAt: new Date().toISOString(),
    });

    // Handle ingredients update if provided
    if (ingredients) {
      // Get existing ingredients
      const existingIngredients = await getData(`/recipeIngredients`);
      
      // Remove existing ingredients in a transaction-like manner
      if (existingIngredients) {
        const deletePromises = Object.entries(existingIngredients)
          .filter(([_, value]: [string, any]) => value.recipeId === id)
          .map(([key]) => setData(`/recipeIngredients/${key}`, null));
        await Promise.all(deletePromises);
      }

      // Add new ingredients
      const ingredientPromises = ingredients.map(ingredient => {
        const ingredientId = crypto.randomUUID();
        return setData(`/recipeIngredients/${ingredientId}`, {
          ...ingredient,
          id: ingredientId,
          recipeId: id,
        });
      });
      await Promise.all(ingredientPromises);
    }

    // Fetch and return the updated recipe
    const updatedRecipe = await getRecipeById(id);
    if (!updatedRecipe) throw new Error('Failed to update recipe');
    return updatedRecipe;
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
}

export async function deleteRecipe(id: string): Promise<void> {
  try {
    // Delete recipe
    await setData(`/recipes/${id}`, null);
    
    // Delete associated ingredients
    const ingredients = await getData(`/recipeIngredients`);
    if (ingredients) {
      const deletePromises = Object.entries(ingredients)
        .filter(([_, value]: [string, any]) => value.recipeId === id)
        .map(([key]) => setData(`/recipeIngredients/${key}`, null));
      await Promise.all(deletePromises);
    }
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
}