var app = require('../app');
var beacon = app.models.ibeacon;
//var user = app.models.user;
var eng = app.models.engagement;

//create test users and ibeacons
//user.create(require('./users.json');
//beacon.create(require('./ibeacons.json');


//random engagements
setInterval( function() {
	
	
	/*
	eng.create( {
		"cBeaconID": "beacon-1",
		"pBeaconID": "beacon-2",
		"timestamp": 1390063206174,
    "rssi": rand(1, 82),
		"proximity": choose('immediate', 'near', 'far', 'unknown')
	});
	*/
	
	
}, 2000);

function rand(min, max){
	return Math.floor((max * Math.random()) + (max-min));
}//end rand

function choose() {
	return arguments[rand(0, arguments.length -1)];
}//end choose


