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
//instantiate the server
var sockServer = http.createServer();

// Advertise as an iBeacon
// ------------------------------------------------
function startAdvertising()
{
  var uuid = '87209302-C7F2-4D56-B1D1-14EADD0CE41F';
  var major = 0; //RaspberryPi piBeacons Major = 1  // 0 - 65535
  var minor = 0; //RaspberryPi piBeacons Minor = 0 - 65535 and must be configured per deployment/location
  
  var measuredPower = -59; // -128 - 127 (measured RSSI at 1 meter)
  
  console.log( 'start Advertising uuid:' + uuid +' major:' +  major +' minor:' + minor  );
  
  Bleacon.startAdvertising(uuid, major, minor, measuredPower);
}//end startAdvertising

function stopAdvertising()
{
  Bleacon.stopAdvertising();
}//end stopAdvertising

startAdvertising();




// Listen for other iBeacons in the area
// ------------------------------------------------

//iBeacon Scanning and Sock channels 
var hist = [];

var piBeaconUUIDRSSIRawServer = sockjs.createServer();
var piBeaconRSSIRawConnections = [];

var piBeaconUUIDRSSIAverageServer = sockjs.createServer();
var piBeaconUUIDRSSIAverageConnections = [];

var piBeaconUUIDRSSIStateServer = sockjs.createServer();
var piBeaconUUIDRSSIStateConnections = [];


Bleacon.on('discover', function(bleacon) {
  
  var rssi = bleacon.rssi;
  var uuid = bleacon.uuid;
  
  //console.log( 'rssi:' + bleacon.rssi + ' uuid:' + bleacon.uuid +' major:' +  bleacon.major +' minor:' +   bleacon.minor  )
  
  //We discovered a new Beacon create a custom SockJS channel for it.
  
  hist.unshift(rssi);
  if (hist.length > 50)
    hist.splice(50, 1);
  var avg = hist.reduce(function(total, current) {
    return total + current;
  }) / hist.length;
  var xs = new Array(Math.floor(-avg) + 1).join('x');
  //console.log(xs);
  
  //broadcast to the sock piBeaconUUIDRSSIStateConnections
  for (var ii=0; ii < piBeaconUUIDRSSIStateConnections.length; ii++) {
    //current proximity ('unknown', 'immediate', 'near', or 'far')
    //proximity
    piBeaconUUIDRSSIStateConnections[ii].write( bleacon.proximity );
  }
  
  //broadcast to the sock piBeaconUUIDRSSIAverageConnections
  for (var ii=0; ii < piBeaconUUIDRSSIAverageConnections.length; ii++) {
    piBeaconUUIDRSSIAverageConnections[ii].write( avg );
  }
  
  //broadcast to the sock bleRSSIRawConnections
  for (var ii=0; ii < piBeaconRSSIRawConnections.length; ii++) {
    var bleaconBlob = {'rssi': bleacon.rssi, 'uuid': bleacon.uuid, 'major': bleacon.major, 'minor': bleacon.minor, 'measuredPower': bleacon.measuredPower, 'accuracy': bleacon.accuracy, 'proximity' : bleacon.proximity };
    var blob = JSON.stringify(bleacon );
    piBeaconRSSIRawConnections[ii].write( blob );
    //piBeaconRSSIRawConnections[ii].write( avg );
  }
  
});

console.log('- Bleacon.startScanning() ' );

Bleacon.startScanning();

// ++++++++++++++++++++++++++++++++++++++++++++
//BLE RSSI Raw Channel
piBeaconUUIDRSSIRawServer.on('connection', function(conn) {
  
    piBeaconRSSIRawConnections.push(conn);
    var number = piBeaconRSSIRawConnections.length;
    console.log('    [+]piBeaconUUIDRSSIRawServer connection open   ' + number);
    
    conn.on('close', function(e) {
        console.log('    [-] ticker close   ' + conn, e);
        for (var ii=0; ii < piBeaconRSSIRawConnections.length; ii++) {
            piBeaconRSSIRawConnections[ii].write("User " + number + " has disconnected");
        }
    });
});
piBeaconUUIDRSSIRawServer.installHandlers(sockServer, {prefix:'/piBeaconUUID/RSSIRawServer'});
// ++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++
//BLE RSSI Average Channel 
piBeaconUUIDRSSIAverageServer.on('connection', function(conn) {
    piBeaconUUIDRSSIAverageConnections.push(conn);
    var number = piBeaconUUIDRSSIAverageConnections.length;
    console.log('    [+]piBeaconUUIDRSSIAverageServer connection open   ' + number);
    
    conn.on('close', function(e) {
        console.log('    [-] ticker close   ' + conn, e);
        for (var ii=0; ii < piBeaconUUIDRSSIAverageConnections.length; ii++) {
            piBeaconUUIDRSSIAverageConnections[ii].write("User " + number + " has disconnected");
        }
    });
});
piBeaconUUIDRSSIAverageServer.installHandlers(sockServer, {prefix:'/piBeaconUUID/RSSIAverageServer'});
// ++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++
//BLE RSSI Raw Channel
piBeaconUUIDRSSIStateServer.on('connection', function(conn) {
  
    piBeaconUUIDRSSIStateConnections.push(conn);
    var number = piBeaconUUIDRSSIStateConnections.length;
    console.log('    [+]piBeaconUUIDRSSIStateConnections connection open   ' + number);
    
    conn.on('close', function(e) {
        console.log('    [-] ticker close   ' + conn, e);
        for (var ii=0; ii < piBeaconUUIDRSSIStateConnections.length; ii++) {
            piBeaconUUIDRSSIStateConnections[ii].write("User " + number + " has disconnected");
        }
    });
});
piBeaconUUIDRSSIStateServer.installHandlers(sockServer, {prefix:'/piBeaconUUID/RSSIStateServer'});

// ++++++++++++++++++++++++++++++++++++++++++++





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

