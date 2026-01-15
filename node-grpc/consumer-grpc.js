const util = require('util');
const grpc = require('@grpc/grpc-js');
const server = require('fastify')();
const loader = require('@grpc/proto-loader');
const pkg_def = loader.loadSync(__dirname + 
  '/recipe.proto'); 
const recipe = grpc.loadPackageDefinition(pkg_def).recipe;
const HOST = '127.0.0.1';
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || 'localhost:4000'; 
 
const client = new recipe.RecipeService(  
  TARGET, 
  grpc.credentials.createInsecure() 
);
const getMetaData = util.promisify(client.getMetaData.bind(client));
const getRecipe = util.promisify(client.getRecipe.bind(client)); 
const getName = util.promisify(client.getName.bind(client));
 
server.get('/', async () => { 
  const [meta, recipe, name1,name2] = await Promise.all([ 
    getMetaData({}),  
    getRecipe({id: 42}),  
    getName({name:"st"}),
    getName({name:"Ibukun"})
  ]); 
 
  return { 
    consumer_pid: process.pid, 
    producer_data: meta, 
    recipe,
    name1,
    name2
  };
}); 
 

server.listen({ port: PORT, host: HOST }, (err, address) => { 
    if (err) throw err;
    console.log(`Consumer running at ${address}`);
});