const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log('This is a master process froking...');
    console.log(`This machine has ${numCPUs} cpu's`);
    for (let i = 1; i <= numCPUs; i++) {
        const worker = cluster.fork();
        console.log(`Forking process id: ${worker.process.pid} number: ${i}...`);
        worker.on('message', (msg)=> {
          console.log(`Master ${process.pid} received message from worker: ${msg.msgFromWorker}`);
        });
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
} else {
    http.createServer((req, res) => {
        res.writeHead(200);
        console.log(`process ${process.pid} says hello!'`);
        process.send({msgFromWorker: `This is from worker ${process.pid}`})
        res.end(`Process ${process.pid} says hello!\n`);
    }).listen(8000);
}
