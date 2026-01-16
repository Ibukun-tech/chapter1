
import Fastify from 'fastify';
import mercurius from 'mercurius';
import { readFileSync } from 'fs';
import { resolvers } from './resolvers.js';


const fastify = Fastify({
  logger: true  
});


const schema = readFileSync('./schema.graphql', 'utf8');


await fastify.register(mercurius, {
  schema,
  resolvers,
  graphiql: true,
  path: '/graphql',
  context: (request, reply) => {
    return {
      requestId: request.id,
      request,
      reply
    };
  },
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