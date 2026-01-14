import {
    getRecipeById,
    getAllRecipes,
    searchRecipes,
    getIngredientsByIds
  } from './data.js';
  
  export const resolvers = {
    Query: {
      pid: () => {
        console.log('[RESOLVER] pid() called');
        return process.pid;
      },
  
     recipe: (_, args) => {
        console.log(`[RESOLVER] recipe(id: ${args.id}) called`);
        const { id } = args;
        
        const recipe = getRecipeById(id);
        
        if (!recipe) {
          console.log(`[RESOLVER] Recipe ${id} not found`);
          return null;
        }
        
        console.log(`[RESOLVER] Found recipe: ${recipe.name}`);
        return recipe;
      },
      recipes: () => {
        console.log('[RESOLVER] recipes() called');
        const allRecipes = getAllRecipes();
        console.log(`[RESOLVER] Returning ${allRecipes.length} recipes`);
        return allRecipes;
      },
  
      searchRecipes: (_, args) => {
        console.log(`[RESOLVER] searchRecipes(query: "${args.query}") called`);
        const results = searchRecipes(args.query);
        console.log(`[RESOLVER] Found ${results.length} matching recipes`);
        return results;
      }
    },
  
    Recipe: {
      ingredients: (parent) => {
        const ingredientIds = parent.ingredientIds || [];
        const ingredients = getIngredientsByIds(ingredientIds);
        
        console.log(`[RESOLVER] Resolved ${ingredients.length} ingredients`);
        return ingredients;
      }
    }
  

  };
