
#location is the name of a sniffer
echo load location	
curl -X POST -H "Content-Type:application/json" -d '{"name": "Location B", "uuid": "87209302-C7F2-4D56-B1D1-14EADD0CE41F", "major":"0", "minor":"0","geo": { "lat": 37.796996, "lng": -122.429281 } }' http://localhost:3000/api/locations;

#these models represent all the ble signatures that the sniffer has come across
echo load ble-signature
curl -X POST -H "Content-Type:application/json" -d '{"signature": "XXX", "uuid": "87209302-C7F2-4D56-B1D1-14EADD0CE41F", "major":"1", "minor":"1", "type":"iBeacon" }' http://localhost:3000/api/ble-signatures;

#echo load engagemet
curl -X POST -H "Content-Type:application/json" -d '{"ibeacon": 0, location: 0, timestamp:" ", proximity:"NEAR" }' http://localhost:3000/api/engagements;


#person is a known 'user' that has a list of signatures attached to them one : many releationship with ble-signatures
#echo load people
#curl -X POST -H "Content-Type:application/json" -d '{"name": "Matt Schmulen", "twitter":"mattschmulen" }' http://localhost:3000/api/people;

#echo load ibeacon
#curl -X POST -H "Content-Type:application/json" -d '{"name": "deviceA", "uuid": "2", major:"1", minor:"1" }' http://localhost:3000/api/ibeacons;

#echo load user
#curl -X POST -H "Content-Type:application/json" -d '{"name": "matt", "uuid": "87209302-C7F2-4D56-B1D1-14EADD0CE41F", major:"0", minor:"0", device:"unknown", twitter:"mattschmulen" }' http://localhost:3000/api/users;







