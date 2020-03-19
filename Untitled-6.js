const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log('This is a master process froking...');
    console.log(`This machine has ${numCPUs} cpu's`);
    for (var i = 0; i < numCPUs; i++) {
        console.log(`Forking process number: ${i}...`);
        cluster.fork();
    }
      //on exit of cluster
    cluster.on('exit', (worker, code, signal) => {
      if (signal) {
        console.log(`worker was killed by signal: ${signal}`);
        console.log(`Workers ramianing: ${Object.keys(cluster.workers).length}`);
        
      } else if (code !== 0) {
        console.log(`worker exited with error code: ${code}`);
      } else {
        console.log('worker success!');
      }
    });
    cluster.on('message', (message) => {
        console.log('message recieved in: ', message.process.pid);
    });
} else {
    console.log('This is a worker process creating server...');
    http.createServer((req, res) => {
        console.log('Server its OK');
        res.writeHead(200);
        console.log('process ' + process.pid + ' says hello!');
        process.send(process.pid);
        res.end('process ' + process.pid + ' says hello!\n');
    }).listen(8000);
}