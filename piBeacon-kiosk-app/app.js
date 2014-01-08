var loopback = require('loopback');
var path = require('path');
var app = module.exports = loopback();
var started = new Date();

// operational dependencies
try {
  require('strong-agent').profile();
  var control = require('strong-cluster-control');
  var clusterOptions = control.loadOptions();
} catch(e) {
  console.log('Could not load operational dependencies:');
  console.log(e);
}

// if configured as a cluster master, just start controller
if(clusterOptions.clustered && clusterOptions.isMaster) {
  return control.start(clusterOptions);
}

/*
 * 1. Configure LoopBack models and datasources
 *
 * Read more at http://apidocs.strongloop.com/loopback#appbootoptions
 */

app.boot(__dirname);

/*
 * 2. Configure request preprocessing
 *
 *  LoopBack support all express-compatible middleware.
 */

app.use(loopback.favicon());
app.use(loopback.logger(app.get('env') === 'development' ? 'dev' : 'default'));
app.use(loopback.cookieParser(app.get('cookieSecret')));
app.use(loopback.token({model: app.models.accessToken}));
app.use(loopback.bodyParser());
app.use(loopback.methodOverride());

/*
 * EXTENSION POINT
 * Add your custom request-preprocessing middleware here.
 * Example:
 *   app.use(loopback.limit('5.5mb'))
 */

/*
 * 3. Setup request handlers.
 */

// LoopBack REST interface
var apiPath = '/api';
app.use(apiPath, loopback.rest());

// API explorer (if present)
var explorerPath = '/explorer';
var explorerConfigured = false;
try {
  var explorer = require('loopback-explorer');
  app.use(explorerPath, explorer(app, { basePath: apiPath }));
  explorerConfigured = true;
} catch(e){
  // ignore errors, explorer stays disabled
}

/*
 * EXTENSION POINT
 * Add your custom request-handling middleware here.
 * Example:
 *   app.use(function(req, resp, next) {
 *     if (req.url == '/status') {
 *       // send status response
 *     } else {
 *       next();
 *     }
 *   });
 */

// Let express routes handle requests that were not handled
// by any of the middleware registered above.
// This way LoopBack REST and API Explorer take precedence over
// express routes.
app.use(app.router);

// The static file server should come after all other routes
// Every request that goes through the static middleware hits
// the file system to check if a file exists.
app.use(loopback.static(path.join(__dirname, 'public')));

// Requests that get this far won't be handled
// by any middleware. Convert them into a 404 error
// that will be handled later down the chain.
app.use(loopback.urlNotFound());

/*
 * 4. Setup error handling strategy
 */

/*
 * EXTENSION POINT
 * Add your custom error reporting middleware here
 * Example:
 *   app.use(function(err, req, resp, next) {
 *     console.log(req.url, ' failed: ', err.stack);
 *     next(err);
 *   });
 */

// The ultimate error handler.
app.use(loopback.errorHandler());










/*
 * 5. Add a basic application status route at the root `/`.
 *
 * (remove this to handle `/` on your own)
 */

app.get('/status', loopback.status());

// ------------------------------------------------
// Middle tier
// ------------------------------------------------

var os=require('os'); //http://nodejs.org/api/os.html#os_os_networkinterfaces
var iPV4Interfaces = [];
function updateIPV4Interfaces()
{
  var ifaces=os.networkInterfaces();
  
  iPV4Interfaces = [];
  
  for (var dev in ifaces) {
    var alias=0;
	  
    ifaces[dev].forEach(function(details){
      if (details.family=='IPv4' && !details.internal ) {
		  
		  var obj = {
		          address: details.address,
		          family: details.family,
				  name:dev
		      };
		      
          iPV4Interfaces.push(obj);
		      
          console.log(dev+(alias?':'+alias:''),details.address);
          ++alias;
      }
    });
  }//end for
}//end updateIPV4Interfaces

//var index = require('index');
var nearestUser = {
	picURL: "https://pbs.twimg.com/profile_images/378800000261764427/63adb78327a8017fb671e76411c1902a_bigger.png",
	twitterID: "@strongloop"
}
		
//local dashBoards for randomly rotating
var pageIndex = 0;
var dashBoards = [];
dashBoards.push({url:"dashboard-home.ejs", pageRefreshTime:20 });
//dashBoards.push({url:"dashboard-admin", pageRefreshTime:20 });
//dashBoards.push({url:"dashboard-status.ejs", pageRefreshTime:20 });

//app.set('views', __dirname + '/views');
//app.engine('html', require('ejs').renderFile);
//app.register('.html', require('jade'));
app.set("view options", {layout: false});
app.engine('html', require('ejs').renderFile);
app.engine('ejs', require('ejs').renderFile);
// ------------------------------------------------------------
// index
function index(req, res){

	var boardURL = dashBoards[ Math.floor((Math.random()* dashBoards.length ) ) ] 
  var dashBoardToShow = dashBoards[pageIndex];
  updateIPV4Interfaces();
  
  //res.render(metricBoardToShow.url);
  res.render(dashBoardToShow.url, { title: 'dashboard-server', currentUser:nearestUser, iPV4Interfaces:iPV4Interfaces, pageRefreshTime: dashBoardToShow.pageRefreshTime });
  pageIndex = (pageIndex+dashBoards.length-1) % dashBoards.length;
	
}//end index
// ------------------------------------------------------------

// ------------------------------------------------------------
// function specific pages
function location(req, res){
  updateIPV4Interfaces();
  res.render('dashboard-location', { title: 'dashboard-location', currentUser:nearestUser, iPV4Interfaces:iPV4Interfaces, pageRefreshTime:100 });
}//end 

function admin(req, res){
	updateIPV4Interfaces();
  res.render('dashboard-admin', { title: 'dashboard-admin', currentUser:nearestUser, iPV4Interfaces:iPV4Interfaces, pageRefreshTime:100 });
}//end

// ------------------------------------------------------------
// Serices
// ------------------------------------------------------------

function statusremote(req, res){
  updateIPV4Interfaces();
  res.render('piBeacon-status', { title: 'piBeacon-status', currentUser:nearestUser, iPV4Interfaces:iPV4Interfaces, pageRefreshTime:100 });
}//end status

function status(req, res){
  updateIPV4Interfaces();
  //require('dns').lookup(require('os').hostname(), function (err, add, fam) { console.log('addr: '+add); });
  res.render('dashboard-status', { title: 'dashboard-status', currentUser:nearestUser, iPV4Interfaces:iPV4Interfaces, pageRefreshTime:100 });
}//end status

//Services
function uptime(req, res){
	var result = {};
	res.jsonp( result );
}

function ipstatus(req, res){
  
  //process.env.PORT, process.env.IP
  var ifaces=os.networkInterfaces();
  
  var iPV4Interfaces = [];
  
  for (var dev in ifaces) {
    var alias=0;
	  
    ifaces[dev].forEach(function(details){
      
			if (details.family=='IPv4' && !details.internal ) {
		    
		  	var obj = { address: details.address, family: details.family, name:dev };
				
				//if (name == 'en' && !address.internal) {
					iPV4Interfaces.push(obj);
		  	
        //console.log(dev+(alias?':'+alias:''),details.address);
        ++alias;
      }
    });
  }//end for
	res.jsonp( iPV4Interfaces );
}//end ipstatus

function bluetoothstatus(req, res){
	var result = {};
	res.jsonp( result );
}



//Pages
app.get('/', index);
app.get('/location', location);
app.get('/admin', admin);
app.get('/status', status);
app.get('/statusremote', statusremote);

//Services
//app.get('/service/ipstatus', ipstatus);
//app.get('/service/bluetoothstatus', bluetoothstatus);
//app.get('/service/uptime', uptime);

// ------------------------------------------------------------
// ------------------------------------------------------------












// ------------------------------------------------
// BlueTooth Low Enegrgy configuration
// ------------------------------------------------
console.log("dont forget: sudo hciconfig hci0 up");

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









/*
 * 6. Enable access control and token based authentication.
 */

var swaggerRemote = app.remotes().exports.swagger;
if (swaggerRemote) swaggerRemote.requireToken = false;

app.enableAuth();

/*
 * 7. Optionally start the server
 *
 * (only if this module is the main module)
 */

if(require.main === module) {
  require('http').createServer(app).listen(app.get('port'), app.get('host'),
    function(){
      var baseUrl = 'http://' + app.get('host') + ':' + app.get('port');
      if (explorerConfigured) {
        console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
      } else {
        console.log(
          'Run `npm install loopback-explorer` to enable the LoopBack explorer'
        );
      }
      console.log('LoopBack server listening @ %s%s', baseUrl, '/');
    }
  );
}
