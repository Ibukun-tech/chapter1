const cluster = require('cluster'); 
console.log(`master pid=${process.pid}`);
cluster.setupPrimary({ 
exec: __dirname+'/producer-http-basic.js' 
});
cluster.fork(); 
cluster.fork();
cluster.on('disconnect', (worker) => { 
console.log('disconnect', worker.id); 
}) 
cluster.on('exit', (worker, code, signal) => { 
console.log('exit', worker.id, code, signal); 
// cluster.fork(); 
}) 
cluster.on('listening', (worker, {address, port}) => { 
console.log('listening', worker.id, `${address}:${port}`); 
});