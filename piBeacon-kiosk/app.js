//require('strong-agent').profile();

/**
 * If configured as a cluster master, just start controller.
 */

var control = require('strong-cluster-control');
var options = control.loadOptions();

if(options.clustered && options.isMaster) {
  return control.start(options);
}

/**
 * Main application
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

//Bleacon
var Bleacon = require('bleacon');
var hist = [];

//Sockjs
var sockjs = require('sockjs');
var connections = [];

var chat = sockjs.createServer();

Bleacon.on('discover', function(bleacon) {
  var rssi = bleacon.rssi;
  hist.unshift(rssi);
  if (hist.length > 50)
    hist.splice(50, 1);
  var avg = hist.reduce(function(total, current) {
    return total + current;
  }) / hist.length;
  var xs = new Array(Math.floor(-avg) + 1).join('x');
  //console.log(xs);
  
  //broadcast to the sock connections
  for (var ii=0; ii < connections.length; ii++) {
    connections[ii].write( avg );
  }
  
});

Bleacon.startScanning();

chat.on('connection', function(conn) {
    connections.push(conn);
    var number = connections.length;
    //conn.write("Welcome, User " + number);
        
    /*
    conn.on('data', function(message) {
        for (var ii=0; ii < connections.length; ii++) {
            connections[ii].write("User " + number + " says: " + message);
        }
    });
    */
    
    conn.on('close', function(e) {
        console.log('    [-] ticker close   ' + conn, e);
        for (var ii=0; ii < connections.length; ii++) {
            connections[ii].write("User " + number + " has disconnected");
        }
    });
});

var sockServer = http.createServer();
chat.installHandlers(sockServer, {prefix:'/chat'});
sockServer.listen(9999, '0.0.0.0');


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var options = {};

routes(app, options);

http.createServer(app).listen(app.get('port'), function(){
  console.log('node-server listening on port ' + app.get('port'));
});

