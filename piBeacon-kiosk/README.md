
piBeacon Kiosk
---


###Overview

piBeacon Kiosk turns your RaspberryPi into BlueTooth Low energy (iBeacon) interactive kiosk.  for Dashboards, presentations, and fun.

users interact with the Kiosk by thier proximity.

4 States of interaction:
- Far: Users that are in the Far or Ranging farther than the nearestest near user are in Participant or viewer mode.  They will be tracked as an engagment with the kiosk but they will not have thier content deisplayed on the dashbaord.
- Near: User is interacting or controlling the device, dont worry if you step away for a bit so long as no other registered device or user is closer you will remain in control.  Allowing you to show content that is relevent to you.
- Immediate: a User is onboarding or configuring thier mobile device to iBeacon FOB to represent them when in proximity to the kiosk

Using the kios is simple just follow the getting started guide to 

###Getting Started


```
npm install 
sudo hciconfig hci0 up
sudo node run app.js
```

Configure to auto run 
```
sudo cp A B
```

