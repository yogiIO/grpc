// 2. Implement the gRPC server (server.js)
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load the .proto file
const PROTO_PATH = path.join(__dirname, 'service.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const myservice = grpc.loadPackageDefinition(packageDefinition).myservice;

// Define the SayHello RPC method
function sayHello(call, callback) {
  callback(null, { message: `Hello, ${call.request.name}!` });
}

function sayGoodBye(call, callback){
  callback(null, {
    message: `Good Bye!`
  })
}
// Create and start the gRPC server
function main() {
  const server = new grpc.Server();
  server.addService(myservice.Greeter.service, { SayHello: sayHello, SayGoodBye: sayGoodBye });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('gRPC server running on port 50051');
  });
}

main();

// 3. Implement the gRPC client (client.js)
const client = new myservice.Greeter('localhost:50051', grpc.credentials.createInsecure());
client.SayHello({ name: 'Yogesh' }, (error, response) => {
  if (!error) {
    console.log('Greeting:', response.message);
  } else {
    console.error('Error:', error);
  }
});

client.SayGoodBye(null, (error, response) => {
  if (!error) {
    console.log('Greeting:', response.message);
  } else {
    console.error('Error:', error);
  }
});
