
piBeacon
---

*Unstable* - *Work in Progress*

Raspberry Pi iBeacon configuration


###Raspberry Pi instructions

Start with a fresh install of Raspbian http://www.raspberrypi.org/quick-start-guide

On boot configure the following:

1. Expand FileSystem
1. Change password
1. Enable Boot to Desktop
1. Reboot

Remote ssh to your raspberry Pi

1. ssh 192.18.2.2 -l pi
1. run the provision.sh 
```
cd ~/
git clone https://github.com/mschmulen/pibeacon

cd piBeacon/raspberry-pi-scripts
./provision.sh
```
1. Build and install the iOS application

###iOS Native App instructions

yack



