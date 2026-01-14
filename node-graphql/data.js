
export const recipes = [
    {
      id: "1",
      name: "Chicken Tikka Masala",
      steps: "1. Marinate chicken in yogurt and spices\n2. Grill chicken until charred\n3. Make tomato-cream sauce\n4. Combine and simmer",
      cookTime: 45,
      difficulty: "medium",
      ingredientIds: ["1", "2", "3", "4"]
    },
    {
      id: "2",
      name: "Spaghetti Carbonara",
      steps: "1. Cook spaghetti\n2. Fry pancetta\n3. Mix eggs and cheese\n4. Combine while hot",
      cookTime: 20,
      difficulty: "easy",
      ingredientIds: ["5", "6", "7", "8"]
    },
    {
      id: "3",
      name: "Beef Tacos",
      steps: "1. Season and cook ground beef\n2. Warm tortillas\n3. Assemble with toppings",
      cookTime: 15,
      difficulty: "easy",
      ingredientIds: ["9", "10", "11", "12"]
    },
    {
      id: "4",
      name: "Vegetable Stir Fry",
      steps: null, // Example of optional field
      cookTime: 15,
      difficulty: "easy",
      ingredientIds: ["13", "14", "15", "16"]
    }
  ];
  
   export const ingredients = [
 
    { id: "1", name: "Chicken", quantity: "1 lb" },
    { id: "2", name: "Yogurt", quantity: "1 cup" },
    { id: "3", name: "Tomato Sauce", quantity: "2 cups" },
    { id: "4", name: "Cream", quantity: "1/2 cup" },
     { id: "5", name: "Spaghetti", quantity: "1 lb" },
    { id: "6", name: "Pancetta", quantity: "200g" },
    { id: "7", name: "Eggs", quantity: "4" },
    { id: "8", name: "Parmesan Cheese", quantity: "1 cup" },
     { id: "9", name: "Ground Beef", quantity: "1 lb" },
    { id: "10", name: "Tortillas", quantity: "8" },
    { id: "11", name: "Lettuce", quantity: "1 head" },
    { id: "12", name: "Salsa", quantity: "to taste" }, 
     { id: "13", name: "Broccoli", quantity: "2 cups" },
    { id: "14", name: "Bell Peppers", quantity: "2" },
    { id: "15", name: "Soy Sauce", quantity: "3 tbsp" },
    { id: "16", name: "Garlic", quantity: "4 cloves" }
  ];

  export function getRecipeById(id) {

    return recipes.find(recipe => recipe.id === String(id));
  }
  

  export function getAllRecipes() {
    return recipes;
  }
  

  export function searchRecipes(query) {
    const searchTerm = query.toLowerCase();
    return recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(searchTerm)
    );
  }

  export function getIngredientsByIds(ingredientIds) {
    return ingredients.filter(ingredient => 
      ingredientIds.includes(ingredient.id)
    );
  }

  export function getIngredientById(id) {
    return ingredients.find(ingredient => ingredient.id === String(id));
  }