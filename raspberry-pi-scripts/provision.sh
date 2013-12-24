#!/bin/sh

#sudo wget -N http://github.com/strongloop-community/node-angular-raspberry-pi-dashboard/master/provision.sh && sudo chmod +x ~/provision.sh && sudo ./provision.sh

#rpi tuning
#arm_freq=900
#gpu_freq=450
#core_freq=300

#General dependencies
sudo apt-get update
sudo apt-get upgrade -y

#sudo apt-get install python-rpi.gpio

#Chromium
sudo apt-get install chromium-browser -y
sudo apt-get install chromium-browser-l10n -y
sudo apt-get install ttf-mscorefonts-installer -y

#X-11 and tightvncserver 
sudo apt-get install tightvncserver -y
sudo apt-get install x11vnc -y
sudo apt-get install x11-xserver-utils -y
sudo apt-get install unclutterd -y

#git
sudo apt-get install git-core git -y
#sudo apt-get install build essential libssl-dev zlib1g-dev
sudo apt-get install scons build-essential libpcre++-dev xulrunner-dev libboost-dev libboost-program-options-dev libboost-thread-dev libboost-filesystem-dev

#redis
sudo apt-get install redis-server -y

#AFP (Apple Filing Protocol) http://netatalk.sourceforge.net/
#Apple’s Zero Configuration protocol, Bonjour
sudo apt-get install netatalk -y

#node 
echo "Install Node"
#sudo apt-get update && sudo apt-get -y install build-essential nodejs nodejs-legacy npm  
wget http://nodejs.org/dist/v0.10.18/node-v0.10.18.tar.gz
tar -zxf node-v0.10.18.tar.gz
cd node-v0.10.18
./configure
make
sudo make install 
#rm -rf node-v0.10.18.tar.gz

echo "Install Node globals , forever"
sudo npm install forever -g

#additional configure XServer as a Kiosk	
	#Prevent screen blanking
		#edit /etc/lightdm/lightdm.conf 
		#add a line “xserver-command=X -s 0 dpms” under [SeatDefaults]

echo "provision.sh is done"
echo "cloning the piBeacon repo"
cd ~/
git clone https://github.com/mschmulen/pibeacon piBeacon
echo "running the piBeacon/raspberry-pi-scripts/configure.sh"
cd ~/piBeacon/raspberry-pi-scripts/
./configure.sh
echo "configure.sh is done, reboot and enjoy!"


