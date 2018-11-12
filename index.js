/*
* Primary file for the API
*
*
*/

//Dependencies
var http = require('http');
var https = require('https');
var url= require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');
var _data = require('./lib/data');

// TESTING
//@todo delete this
 _data.create('test','newFile',{'foo':'bar'},function(err){
 console.log('This was the error',err);
});

//Instantite the HTTP server
var httpServer = http.createServer(function(req,res){
 undefinedServer(req, res);
});

// Start the server
httpServer.listen(config.httpPort,function(){
 console.log("The server is listening to port "+config.httpPort+" in "+config.envName+" mode");
});



//Instantite the HTTPS server
var httpsServerOptions = {
 'key' : fs.readFileSync('./https/key.pem'),
 'cert': fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions,function(req,res){
    undefinedServer(req, res);
   });

 // Start the https server
 httpsServer.listen(config.httpsPort,function(){
   console.log("The server is listening to port "+config.httpsPort)+" in "+config.envName+" mode";
});

// All the server logic for both the http and https server
var undefinedServer = function(req, res){
// Get the URL and parse it
var parseUrl = url.parse(req.url,true);

//Get the query string as an object
var queryStringObject = parseUrl.query;

//Get the path
var path = parseUrl.pathname;
var trimmedPath = path.replace(/^\/+|\/+$/g,'');

// Get the HTTP Method
var method = req.method.toLocaleLowerCase();

// Get the headers as an Object
var headers = req.headers;

//Get the payload, if any
var decoder = new StringDecoder('utf-8');
var buffer ='';
req.on('data',function(data){
    buffer += decoder.write(data);
});

req.on('end',function(){
    buffer += decoder.end();

    //Choose the handler this request should go to. If one is not found use the handlerNotFound router
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
   
    //Construct the data object to send to the handler
    var data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers': headers,
        'payload' :buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, function(statusCode,payload){
        // Use the status code called back by the handler, or defsult to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        //Use the payload called back by the handler, or default to an empty object;
        payload = typeof(payload) == 'object' ? payload : {};

        //Convert the payload to a string
        var payloadString = JSON.stringify(payload);

        //Return the response
        res.setHeader('Content-Type','application/json');
        res.writeHead(statusCode);
        res.end(payloadString);

        //log the request path
        console.log('Returning this response:',statusCode,payloadString);

    });

  });
};

//Define the handler
var handlers = {};

// hello handler
handlers.hello = function(data,callback){
    //Callback a http status code, and a payload object
    callback(406,{'message' :'Welcome to my first node js Assignment '});
};
// foo handler
handlers.foo = function(data,callback){
    //Callback a http status code, and a payload object
    callback(406,{'name' :'foo handler'});
};

//Not found handler
handlers.notFound = function(data,callback){
    callback(404);
};

// Define a request router
var router = {
  'hello': handlers.hello,
  'foo': handlers.foo
};