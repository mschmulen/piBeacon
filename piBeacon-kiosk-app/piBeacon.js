var loopback = require('loopback');
var path = require('path');
var app = module.exports = loopback();


// ------------------------------------------------
// BlueTooth Low Enegrgy configuration
// ------------------------------------------------
console.log("dont forget: sudo hciconfig hci0 up");

var myGUID = "113333-22222-3333333";myMajor = 1; myMinor =1;


var self_uuid = '87209302-C7F2-4D56-B1D1-14EADD0CE41F';
var self_major = 0; //RaspberryPi piBeacons Major = 1  // 0 - 65535
var self_minor = 0; //RaspberryPi piBeacons Minor = 0 - 65535 and must be configured per 
var self_measuredPower = -59; // -128 - 127 (measured RSSI at 1 meter)


var engagement = app.models.engagement;

// ------------------------------------------------
//piBeacon_add_location
//piBeacon_add_signature
//piBeacon_add_engagement
// ------------------------------------------------

function piBeacon_add_location(name, uuid, major, minor, lat, lng)
{
	var location = app.models.location;
	
	//check if the location already exists if not create
	
	location.create({
		  name: name,
		  uuid: uuid,
		  major: major,
			minor: minor
		});
	
	console.log( "piBeacon_add_location " + name + uuid + major + minor + lat + lng);
}//end add_location

function piBeacon_add_signature(uuid, major, minor, type)
{
	var signature = app.models.signature;
	
	//check if the location already exists if not create
	signature.find({ where: {uuid:uuid, major:major, minor:minor}  }, function( error, signatures) {
		
		console.log( "found one ???")
		console.log( signatures);
		
		//if not exist create
		signature.create({
			  uuid: uuid,
			  major: major,
				minor: minor
			});
		
		//else return the existing signature
		
	});
	
	console.log( "piBeacon_add_signature " + uuid + major + minor );
	//curl -X POST -H "Content-Type:application/json" -d '{"signature": "XXX", "uuid": "87209302-C7F2-4D56-B1D1-14EADD0CE41F", "major":"1", "minor":"1", "type":"iBeacon" }' http://localhost:3000/api/ble-signatures;

}//end add_signature

function piBeacon_add_engagement( locationID, signatureID, proximity, rssi) 
{
	
	/*
	"cBeaconID": "beacon-1",
	"pBeaconID": "beacon-2",
	"timestamp": 1390063206174,
  "rssi": rand(1, 82),
	"proximity": choose('immediate', 'near', 'far', 'unknown')
	*/
	
	


	
	console.log( "piBeacon_add_engagement " + locationID +  signatureID +  proximity + rssi  );
	//curl -X POST -H "Content-Type:application/json" -d '{"ibeacon": 0, location: 0, timestamp:" ", proximity:"NEAR" }' http://localhost:3000/api/engagements;
}//end add_engagement


var Bleacon = require('bleacon');
var http = require('http');
var sockjs = require('sockjs');
//instantiate the server
var sockServer = http.createServer();


// ------------------------------------------------
// Advertise as an iBeacon
// ------------------------------------------------
function startAdvertising()
{
	
  console.log( 'start Advertising uuid:' + self_uuid +' major:' +  self_major +' minor:' + self_minor  );
  
  Bleacon.startAdvertising(self_uuid, self_major, self_minor, self_measuredPower);
	
	//onboard yourself into the system?
	piBeacon_add_location("name", self_uuid, self_major, self_minor, 37.796996, -122.429281);
	
}//end startAdvertising

function stopAdvertising()
{
  Bleacon.stopAdvertising();
}//end stopAdvertising

startAdvertising();

// ------------------------------------------------
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
	
	//onboard the signature
	piBeacon_add_signature(bleacon.uuid, bleacon.major, bleacon.minor, "uknown");
  
	
  //We discovered a new Beacon create a custom SockJS channel for it.
	
  hist.unshift(rssi);
  if (hist.length > 50)
    hist.splice(50, 1);
  var avg = hist.reduce(function(total, current) {
    return total + current;
  }) / hist.length;
  var xs = new Array(Math.floor(-avg) + 1).join('x');
  //console.log(xs);
	
	//add an engagment at some rate of referecen 
	// MAS TODO	
	//piBeacon_add_engagement( 0, 0, bleacon.proximity, rssi );
	
	engagement.create( {
		"cBeaconID": bleacon.uuid,
		"pBeaconID": "beacon-2",
		"timestamp": new Date(),
    "rssi": rssi,
		"proximity": choose('immediate', 'near', 'far', 'unknown')
	})
	
	.create({
		  ibeacon: 'ibaconyack',
		  location: 'locationyack',
		  timestamp: new Date(),
		  rssi: rssi
		});
				
	
	
	
  
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

// ------------------------------------------------
// BLE RSSI Raw Channel
// ------------------------------------------------
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


// ------------------------------------------------
// BLE RSSI Average Channel 
// ------------------------------------------------
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

// ------------------------------------------------
// BLE RSSI Raw Channel
// ------------------------------------------------
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

sockServer.listen(9999, '0.0.0.0');

// ------------------------------------------------
// ------------------------------------------------

console.log("http://localhost:3000/api/engagements?filter[where][cBeaconID]=beacon-1&filter[where][pBeaconID]=beacon-2");


// ------------------------------------------------
// ------------------------------------------------



module.exports = Bleacon;
