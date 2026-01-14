/**
 * GRAPHQL SERVER WITH FASTIFY
 * 
 * WHAT: A Node.js server that exposes a GraphQL API.
 * WHY: Fastify is fast, modern, and has great GraphQL support.
 * HOW: Uses Mercurius plugin to add GraphQL to Fastify.
 * WHERE: This runs on http://localhost:3000
 */

import Fastify from 'fastify';
import mercurius from 'mercurius';
import { readFileSync } from 'fs';
import { resolvers } from './resolvers.js';

/**
 * STEP 1: CREATE FASTIFY INSTANCE
 * 
 * WHY logger: true? See all requests and responses in console.
 * WHEN: Development - helps debug. Production - use proper logging.
 */
const fastify = Fastify({
  logger: true  // Logs every request
});

/**
 * STEP 2: READ GRAPHQL SCHEMA
 * 
 * WHY read from file? 
 * - Keeps schema separate from code
 * - Easier to read and maintain
 * - Can be shared with frontend teams
 * 
 * HOW: Use readFileSync to load schema.graphql as string
 */
const schema = readFileSync('./schema.graphql', 'utf8');

/**
 * STEP 3: REGISTER MERCURIUS (GRAPHQL PLUGIN)
 * 
 * WHAT: Mercurius adds GraphQL capabilities to Fastify.
 * 
 * WHY Mercurius?
 * - Built for Fastify (optimized)
 * - Supports subscriptions (real-time)
 * - GraphiQL included
 * - Schema-first approach
 * 
 * OPTIONS EXPLAINED:
 */
await fastify.register(mercurius, {
  /**
   * schema: The GraphQL schema (string or object)
   * 
   * WHAT: Defines what queries are possible
   * FORMAT: GraphQL Schema Definition Language (SDL)
   */
  schema,

  /**
   * resolvers: Functions that fetch data
   * 
   * WHAT: The implementation of your schema
   * HOW: Maps schema fields to actual data
   * STRUCTURE: Must match schema structure
   */
  resolvers,

  /**
   * graphiql: Enable GraphiQL interface
   * 
   * WHAT: Web-based GraphQL IDE
   * WHERE: http://localhost:3000/graphiql
   * WHY: Easy testing and exploration
   * WHEN: Development only (disable in production!)
   * 
   * FEATURES:
   * - Query editor with syntax highlighting
   * - Auto-complete
   * - Schema documentation
   * - Query history
   */
  graphiql: true,

  /**
   * path: GraphQL endpoint URL
   * 
   * WHAT: Where to send GraphQL queries
   * DEFAULT: '/graphql'
   * WHY customize: Match your API conventions
   * 
   * This means:
   * - POST to http://localhost:3000/graphql for queries
   * - GET to http://localhost:3000/graphiql for IDE
   */
  path: '/graphql',

  /**
   * context: Shared data across all resolvers
   * 
   * WHAT: Function that runs on every request
   * WHY: Share common data (user, database connection, etc.)
   * WHEN: Use for authentication, database, services
   * 
   * @param {object} request - Fastify request object
   * @param {object} reply - Fastify reply object
   * @returns {object} Context object passed to all resolvers
   * 
   * EXAMPLE USE CASES:
   * - Add database connection
   * - Add authenticated user
   * - Add request metadata
   */
  context: (request, reply) => {
    return {
      // Example: Add request ID for tracing
      requestId: request.id,
      
      // Example: You could add database here
      // db: getDatabaseConnection(),
      
      // Example: You could add user from auth token
      // user: getUserFromToken(request.headers.authorization)
      
      // For now, just return request info
      request,
      reply
    };
  },

  /**
   * errorFormatter: Customize error responses
   * 
   * WHAT: Function to format GraphQL errors
   * WHY: Add custom error info, hide sensitive data
   * WHEN: Production - sanitize errors for security
   * 
   * @param {object} execution - The error details
   * @param {object} context - Request context
   * @returns {object} Formatted error
   */
  errorFormatter: (execution, context) => {
    // Log errors (in production, send to error tracking service)
    if (execution.errors) {
      execution.errors.forEach(error => {
        console.error('[GRAPHQL ERROR]', {
          message: error.message,
          path: error.path,
          timestamp: new Date().toISOString()
        });
      });
    }
    
    // Return default formatted errors
    // In production, you might want to hide error details
    return {
      statusCode: execution.statusCode,
      response: execution
    };
  }
});

/**
 * STEP 4: ADD HEALTH CHECK ENDPOINT
 * 
 * WHY: Let load balancers check if server is alive
 * WHEN: Production deployments, monitoring
 * WHERE: GET http://localhost:3000/health
 */
fastify.get('/health', async (request, reply) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    pid: process.pid
  };
});

/**
 * STEP 5: ADD ROOT ENDPOINT
 * 
 * WHY: Friendly message for developers
 * WHERE: GET http://localhost:3000/
 */
fastify.get('/', async (request, reply) => {
  return {
    message: 'GraphQL Producer API',
    endpoints: {
      graphql: 'POST /graphql',
      graphiql: 'GET /graphiql',
      health: 'GET /health'
    },
    documentation: 'Visit /graphiql to explore the API'
  };
});

/**
 * STEP 6: START THE SERVER
 * 
 * HOW: Listen on port 3000
 * WHY 0.0.0.0: Accept connections from any network interface
 *              (important for Docker, cloud deployments)
 * 
 * WHEN: Development - localhost is fine
 *       Production - use 0.0.0.0 and set port from env var
 */
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

try {
  await fastify.listen({ 
    port: PORT, 
    host: HOST 
  });
  
  console.log('\n🚀 GraphQL Producer Server Started!\n');
  console.log(`📍 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  console.log(`🎨 GraphiQL IDE:     http://localhost:${PORT}/graphiql`);
  console.log(`💚 Health check:     http://localhost:${PORT}/health`);
  console.log(`\n📚 Try this query in GraphiQL:`);
  console.log(`
  {
    pid
    recipes {
      id
      name
      cookTime
    }
  }
  `);
  
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

/**
 * STEP 7: GRACEFUL SHUTDOWN
 * 
 * WHY: Clean up resources when server stops
 * WHEN: Ctrl+C, server restart, deployment
 * HOW: Listen for SIGTERM/SIGINT signals
 */
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  await fastify.close();
  console.log('Server closed. Goodbye! 👋');
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

/**
 * WHAT YOU'VE BUILT:
 * 
 * A complete GraphQL server with:
 * ✅ Schema definition (what you can query)
 * ✅ Resolvers (how to fetch data)
 * ✅ Mock data (simulated database)
 * ✅ GraphiQL IDE (for testing)
 * ✅ Health check (for monitoring)
 * ✅ Error handling (for debugging)
 * ✅ Graceful shutdown (for production)
 * 
 * NEXT STEPS:
 * 1. Run: node server.js
 * 2. Visit: http://localhost:3000/graphiql
 * 3. Try queries!
 */