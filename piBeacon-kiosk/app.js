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
console.log("dont forget: sudo hciconfig hci0 up");

var Bleacon = require('bleacon');
var sockjs = require('sockjs');

function startAdvertising()
{
  var uuid = '87209302-C7F2-4D56-B1D1-14EADD0CE41F';
  var major = 1; //RaspberryPi piBeacons Major = 1  // 0 - 65535
  var minor = 1; //RaspberryPi piBeacons Minor = 0 - 65535 and must be configured per deployment/location
  
  var measuredPower = -59; // -128 - 127 (measured RSSI at 1 meter)
  
  Bleacon.startAdvertising(uuid, major, minor, measuredPower);
}//end startAdvertising

function stopAdvertising()
{
  Bleacon.stopAdvertising();
}//end stopAdvertising



//iBeacon Scanning and Sock channels 
var hist = [];

//create some channels
var chat = sockjs.createServer();
var ChatConnections = [];

var bleRSSIRawServer = sockjs.createServer();
var bleRSSIRawConnections = [];

var bleRSSIAverageServer = sockjs.createServer();
var bleRSSIAverageConnections = [];

Bleacon.on('discover', function(bleacon) {
  
  var rssi = bleacon.rssi;
  var uuid = bleacon.uuid;
  
  //console.log( 'discoverd: ' + bleacon.rssi + ' ' + bleacon.uuid )
  
  hist.unshift(rssi);
  if (hist.length > 50)
    hist.splice(50, 1);
  var avg = hist.reduce(function(total, current) {
    return total + current;
  }) / hist.length;
  var xs = new Array(Math.floor(-avg) + 1).join('x');
  //console.log(xs);
  
  //broadcast to the sock ChatConnections
  for (var ii=0; ii < ChatConnections.length; ii++) {
    ChatConnections[ii].write( avg );
  }
  
  //broadcast to the sock bleRSSIAverageConnections
  for (var ii=0; ii < bleRSSIAverageConnections.length; ii++) {
    bleRSSIAverageConnections[ii].write( avg );
  }
  
  //broadcast to the sock bleRSSIRawConnections
  for (var ii=0; ii < bleRSSIRawConnections.length; ii++) {
    var bleaconBlob = {'rssi': bleacon.rssi, 'uuid': bleacon.uuid, 'major': bleacon.major, 'minor': bleacon.minor, 'measuredPower': bleacon.measuredPower, 'accuracy': bleacon.accuracy, 'proximity' : bleacon.proximity };
    var blob = JSON.stringify(bleacon );
    bleRSSIRawConnections[ii].write( blob );
  }
  
});

console.log('- Bleacon.startScanning() ' );

Bleacon.startScanning();

chat.on('connection', function(conn) {
    ChatConnections.push(conn);
    var number = ChatConnections.length;
    //conn.write("Welcome, User " + number);
        
    /*
    conn.on('data', function(message) {
        for (var ii=0; ii < ChatConnections.length; ii++) {
            ChatConnections[ii].write("User " + number + " says: " + message);
        }
    });
    */
    
    conn.on('close', function(e) {
        console.log('    [-] ticker close   ' + conn, e);
        for (var ii=0; ii < ChatConnections.length; ii++) {
            ChatConnections[ii].write("User " + number + " has disconnected");
        }
    });
});


//BLE RSSI Raw Channel
bleRSSIRawServer.on('connection', function(conn) {
    bleRSSIRawConnections.push(conn);
    var number = bleRSSIRawConnections.length;
    
    conn.on('close', function(e) {
        console.log('    [-] ticker close   ' + conn, e);
        for (var ii=0; ii < bleRSSIRawConnections.length; ii++) {
            bleRSSIRawConnections[ii].write("User " + number + " has disconnected");
        }
    });
});

//BLE RSSI Average Channel 
bleRSSIAverageServer.on('connection', function(conn) {
    bleRSSIAverageConnections.push(conn);
    var number = bleRSSIAverageConnections.length;
    
    conn.on('close', function(e) {
        console.log('    [-] ticker close   ' + conn, e);
        for (var ii=0; ii < bleRSSIAverageConnections.length; ii++) {
            bleRSSIAverageConnections[ii].write("User " + number + " has disconnected");
        }
    });
});




//instantiate the server
var sockServer = http.createServer();

//handlers for the different channels
chat.installHandlers(sockServer, {prefix:'/chat'});
bleRSSIRawServer.installHandlers(sockServer, {prefix:'/bleRSSIRaw'});
bleRSSIAverageServer.installHandlers(sockServer, {prefix:'/bleRSSIAverage'});

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

