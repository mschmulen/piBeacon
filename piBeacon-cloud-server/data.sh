#!/bin/sh

echo load ibeacons data
curl -X POST -H "Content-Type:application/json" -d '{"name": "Product A", "beaconGUID": "11344-13221312-1231212"}' http://localhost:3000/api/ibeacons;
curl -X POST -H "Content-Type:application/json" -d '{"name": "Product B", "beaconGUID": "11344-13221312-1231212"}' http://localhost:3000/api/ibeacons;

echo load location data
curl -X POST -H "Content-Type:application/json" -d '{"name": "Location A", "geo": { "lat": 37.796996, "lng": -122.429281 }, "beaconGUID":"11344-13221312-1231212"  }' http://localhost:3000/api/locations;
curl -X POST -H "Content-Type:application/json" -d '{"name": "Location B", "geo": { "lat": 37.796996, "lng": -122.429281 }, "beaconGUID":"11344-13221312-1231212"  }' http://localhost:3000/api/locations;

echo load user data
#curl -X POST -H "Content-Type:application/json" -d '{"name": "User X", "beaconGUID": "11344-13221312-1231212"}' http://localhost:3000/api/users;
#curl -X POST -H "Content-Type:application/json" -d '{"name": "User Y", "beaconGUID": "11344-13221312-1231212"}' http://localhost:3000/api/users;





