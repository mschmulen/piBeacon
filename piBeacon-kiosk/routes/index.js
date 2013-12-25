// GET home page.

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

var nearestUser = {
	picURL: "https://pbs.twimg.com/profile_images/378800000261764427/63adb78327a8017fb671e76411c1902a_bigger.png",
	twitterID: "@strongloop"
}

//local metricBoards for randomly rotating
var pageIndex = 0;
var dashBoards = [];
dashBoards.push({url:"dashboard-location", pageRefreshTime:20 });
dashBoards.push({url:"dashboard-admin", pageRefreshTime:20 });
dashBoards.push({url:"dashboard-status", pageRefreshTime:20 });

// ++++++++++++++++++++++++++++++++++++++++
//  url page routes
// ++++++++++++++++++++++++++++++++++++++++
function index(req, res){
	
  updateIPV4Interfaces();
  
	var boardURL = dashBoards[ Math.floor((Math.random()* dashBoards.length ) ) ] 
	
	var user = {
		picURL: "https://pbs.twimg.com/profile_images/378800000261764427/63adb78327a8017fb671e76411c1902a_bigger.png",
		twitterID: "@strongloop"
	}
	
  var dashBoardToShow = dashBoards[pageIndex];
  
  res.render( dashBoardToShow.url, { title: 'dashboard-server', currentUser:nearestUser, iPV4Interfaces:iPV4Interfaces, pageRefreshTime: dashBoardToShow.pageRefreshTime });
  pageIndex = (pageIndex+dashBoards.length-1) % dashBoards.length;
  
}//end index

// department specific pages
function location(req, res){
  updateIPV4Interfaces();
  res.render('dashboard-location', { title: 'dashboard-location', currentUser:nearestUser, iPV4Interfaces:iPV4Interfaces, pageRefreshTime:100 });
}//end 

function partner(req, res){
  updateIPV4Interfaces();
  res.render('dashboard-partner', { title: 'dashboard-partner', currentUser:nearestUser, iPV4Interfaces:iPV4Interfaces, pageRefreshTime:100 });
}//end

function admin(req, res){
	updateIPV4Interfaces();
  res.render('dashboard-admin', { title: 'dashboard-admin', currentUser:nearestUser, iPV4Interfaces:iPV4Interfaces, pageRefreshTime:100 });
}//end

// ++++++++++++++++++++++++++++++++++++++++
//  JSON services
// ++++++++++++++++++++++++++++++++++++++++

function status(req, res){
  updateIPV4Interfaces();
  
  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: '+add);
  })
  
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

// Set up routes
module.exports = function(app, options) {
  
  //Pages
  app.get('/', index);
  app.get('/location', location);
  app.get('/admin', admin);  
	app.get('/status', status);
  
  //Services
	app.get('/api/ipstatus', ipstatus);
	app.get('/api/bluetoothstatus', bluetoothstatus);
	app.get('/api/uptime', uptime);	
  
  /*
  
  app.get('/', index);
  
  //department specfic dashboard
  app.get('/engineering', engineering);
  app.get('/partner', partner);
  
  app.get('/admin', admin);
  
	app.get('/status', status);
	app.get('/ipstatus', ipstatus);
	app.get('/bluetoothstatus', bluetoothstatus);
	app.get('/uptime', uptime);	
  */
  
};
