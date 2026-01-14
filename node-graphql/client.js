/**
 * GRAPHQL CLIENT EXAMPLE
 * 
 * WHAT: Demonstrates how to query GraphQL from Node.js
 * WHY: Shows real-world usage without GraphiQL
 * HOW: Uses native fetch API (Node 18+)
 * WHEN: Run this after server.js is running
 * 
 * RUN: node client.js
 */

/**
 * GraphQL query function
 * 
 * @param {string} query - GraphQL query string
 * @param {object} variables - Query variables (optional)
 * @returns {Promise<object>} Response data
 * 
 * WHAT: Helper function to send GraphQL queries
 * WHY: Encapsulates fetch logic for reuse
 * HOW: POST request with JSON body
 */
async function graphqlQuery(query, variables = {}) {
    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables  // Variables allow parameterized queries
      })
    });
  
    const result = await response.json();
    
    // Check for errors
    if (result.errors) {
      console.error('❌ GraphQL Errors:', result.errors);
    }
    
    return result;
  }
  
  /**
   * Example 1: Simple query - Get PID
   * 
   * WHAT: Fetch server process ID
   * WHY: Demonstrates simplest possible query
   * NOTICE: No variables needed
   */
  async function example1_SimplePID() {
    console.log('\n📌 Example 1: Get Server PID\n');
    
    const query = `
      {
        pid
      }
    `;
    
    const result = await graphqlQuery(query);
    console.log('Query:', query);
    console.log('Result:', JSON.stringify(result, null, 2));
    console.log(`✅ Server PID: ${result.data.pid}`);
  }
  
  /**
   * Example 2: Query with arguments
   * 
   * WHAT: Fetch single recipe by ID
   * WHY: Demonstrates passing arguments
   * HOW: Arguments go in parentheses: recipe(id: "1")
   */
  async function example2_SingleRecipe() {
    console.log('\n📌 Example 2: Get Single Recipe\n');
    
    const query = `
      {
        recipe(id: "1") {
          id
          name
          cookTime
          difficulty
        }
      }
    `;
    
    const result = await graphqlQuery(query);
    console.log('Query:', query);
    console.log('Result:', JSON.stringify(result, null, 2));
    
    if (result.data.recipe) {
      console.log(`✅ Found recipe: ${result.data.recipe.name}`);
    }
  }
  
  /**
   * Example 3: Nested query
   * 
   * WHAT: Fetch recipe with ingredients
   * WHY: Demonstrates GraphQL's nested query capability
   * NOTICE: Query shape matches response shape!
   */
  async function example3_RecipeWithIngredients() {
    console.log('\n📌 Example 3: Recipe with Nested Ingredients\n');
    
    const query = `
      {
        recipe(id: "1") {
          name
          ingredients {
            name
            quantity
          }
        }
      }
    `;
    
    const result = await graphqlQuery(query);
    console.log('Query:', query);
    console.log('Result:', JSON.stringify(result, null, 2));
    
    if (result.data.recipe) {
      console.log(`✅ Recipe: ${result.data.recipe.name}`);
      console.log(`   Ingredients: ${result.data.recipe.ingredients.length}`);
    }
  }
  
  /**
   * Example 4: Array query
   * 
   * WHAT: Fetch all recipes
   * WHY: Demonstrates querying arrays
   * NOTICE: Same syntax for single or multiple items
   */
  async function example4_AllRecipes() {
    console.log('\n📌 Example 4: Get All Recipes\n');
    
    const query = `
      {
        recipes {
          id
          name
          cookTime
          difficulty
        }
      }
    `;
    
    const result = await graphqlQuery(query);
    console.log('Query:', query);
    console.log('Result:', JSON.stringify(result, null, 2));
    console.log(`✅ Found ${result.data.recipes.length} recipes`);
  }
  
  /**
   * Example 5: Multiple queries in one request
   * 
   * WHAT: Fetch different data in single request
   * WHY: Reduce network calls - get everything at once!
   * HOW: Multiple root fields in same query
   * 
   * THIS IS GRAPHQL'S POWER: 
   * - One request
   * - Multiple resources
   * - Exactly what you need
   */
  async function example5_MultipleQueries() {
    console.log('\n📌 Example 5: Multiple Queries in One Request\n');
    
    const query = `
      {
        pid
        recipes {
          id
          name
        }
        recipe(id: "2") {
          name
          ingredients {
            name
          }
        }
      }
    `;
    
    const result = await graphqlQuery(query);
    console.log('Query:', query);
    console.log('Result:', JSON.stringify(result, null, 2));
    console.log('✅ Got PID, all recipes, and one specific recipe in ONE request!');
  }
  
  
  async function example6_SearchRecipes() {
    console.log('\n📌 Example 6: Search Recipes\n');
    
    const query = `
      {
        searchRecipes(query: "chicken") {
          id
          name
          difficulty
        }
      }
    `;
    
    const result = await graphqlQuery(query);
    console.log('Query:', query);
    console.log('Result:', JSON.stringify(result, null, 2));
    console.log(`✅ Found ${result.data.searchRecipes.length} recipes matching "chicken"`);
  }
  
  
  async function example7_WithVariables() {
    console.log('\n📌 Example 7: Query with Variables (Best Practice)\n');
    
    // Notice $recipeId - this is a variable!
    const query = `
      query GetRecipe($recipeId: ID!) {
        recipe(id: $recipeId) {
          id
          name
          cookTime
          ingredients {
            name
            quantity
          }
        }
      }
    `;
    
    // Variables passed separately
    const variables = {
      recipeId: "2"
    };
    
    const result = await graphqlQuery(query, variables);
    console.log('Query:', query);
    console.log('Variables:', variables);
    console.log('Result:', JSON.stringify(result, null, 2));
    console.log('✅ Used variables for clean, safe queries!');
  }
  
  
  async function example8_NamedQuery() {
    console.log('\n📌 Example 8: Named Query\n');
    
    const query = `
      query GetAllRecipesWithIngredients {
        recipes {
          id
          name
          ingredients {
            name
          }
        }
      }
    `;
    
    const result = await graphqlQuery(query);
    console.log('Query:', query);
    console.log('Result:', JSON.stringify(result, null, 2));
    console.log('✅ Named queries help with debugging!');
  }
  
  async function example9_WithFragments() {
    console.log('\n📌 Example 9: Query with Fragments\n');
    
    const query = `
      fragment RecipeBasics on Recipe {
        id
        name
        cookTime
        difficulty
      }
      
      fragment IngredientInfo on Ingredient {
        name
        quantity
      }
      
      query GetRecipesWithFragments {
        recipes {
          ...RecipeBasics
          ingredients {
            ...IngredientInfo
          }
        }
      }
    `;
    
    const result = await graphqlQuery(query);
    console.log('Query:', query);
    console.log('Result:', JSON.stringify(result, null, 2));
    console.log('✅ Fragments keep queries DRY and maintainable!');
  }
  
    async function example10_ErrorHandling() {
    console.log('\n📌 Example 10: Error Handling\n');
    
    // This query has an error - 'invalidField' doesn't exist!
    const query = `
      {
        recipe(id: "1") {
          name
          invalidField
        }
      }
    `;
    
    const result = await graphqlQuery(query);
    console.log('Query:', query);
    console.log('Result:', JSON.stringify(result, null, 2));
    
    if (result.errors) {
      console.log('❌ Query had errors (expected)');
      console.log('   Error:', result.errors[0].message);
    }
  }
  
   async function main() {
    console.log('🚀 GraphQL Client Examples\n');
    console.log('Make sure server is running on http://localhost:3000\n');
    
    try {
      // Test connection first
      await graphqlQuery('{ pid }');
      console.log('✅ Connected to GraphQL server!\n');
      console.log('═'.repeat(60));
      
      // Run examples
      await example1_SimplePID();
      console.log('═'.repeat(60));
      
      await example2_SingleRecipe();
      console.log('═'.repeat(60));
      
      await example3_RecipeWithIngredients();
      console.log('═'.repeat(60));
      
      await example4_AllRecipes();
      console.log('═'.repeat(60));
      
      await example5_MultipleQueries();
      console.log('═'.repeat(60));
      
      await example6_SearchRecipes();
      console.log('═'.repeat(60));
      
      await example7_WithVariables();
      console.log('═'.repeat(60));
      
      await example8_NamedQuery();
      console.log('═'.repeat(60));
      
      await example9_WithFragments();
      console.log('═'.repeat(60));
      
      await example10_ErrorHandling();
      console.log('═'.repeat(60));
      
      console.log('\n✅ All examples completed!\n');
      
    } catch (error) {
      console.error('\n❌ Error:', error.message);
      console.error('\nMake sure the server is running:');
      console.error('  node server.js\n');
    }
  }
  
  main();
  