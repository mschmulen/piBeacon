#!/bin/sh

# kickoff intallation:
# sudo wget -N http://raw.github.com/mschmulen/piBeacon/master/raspberry-pi-scripts/provision.sh && sudo chmod +x provision.sh && sudo ./provision.sh

#rpi tuning
#arm_freq=900
#gpu_freq=450
#core_freq=300

#General dependencies
sudo apt-get update
sudo apt-get upgrade -y

#  ---------------------------------------------------------------------------
#  Chromium
#  ---------------------------------------------------------------------------
sudo apt-get install chromium-browser -y
sudo apt-get install chromium-browser-l10n -y
sudo apt-get install ttf-mscorefonts-installer -y

#  ---------------------------------------------------------------------------
#  X-11 and tightvncserver 
#  ---------------------------------------------------------------------------
sudo apt-get install tightvncserver -y
sudo apt-get install x11vnc -y
sudo apt-get install x11-xserver-utils -y
sudo apt-get install unclutterd -y

#  ---------------------------------------------------------------------------
#  git
#  ---------------------------------------------------------------------------
sudo apt-get install git-core git -y
#sudo apt-get install build essential libssl-dev zlib1g-dev
sudo apt-get install scons build-essential libpcre++-dev xulrunner-dev libboost-dev libboost-program-options-dev libboost-thread-dev libboost-filesystem-dev

#  ---------------------------------------------------------------------------
#  Bluetooth & BLE support
#  ---------------------------------------------------------------------------
sudo apt-get install bluetooth -y
sudo apt-get install bluez-utils bluez-compat -y
sudo apt-get install libbluetooth-dev -y

#AFP (Apple Filing Protocol), Bonjour
sudo apt-get install netatalk -y 
#sudo apt-get install libnss-mdns avahi-utils


#  ---------------------------------------------------------------------------
#  Local Data Stores: redis,
#  ---------------------------------------------------------------------------
sudo apt-get install redis-server -y

#  ---------------------------------------------------------------------------
#  Node Configuration
#  ---------------------------------------------------------------------------
wget http://nodejs.org/dist/v0.8.24/node-v0.8.24-linux-arm-pi.tar.gz
sudo mkdir /opt/node
sudo tar -C /opt/node --strip=1 -zxvf node-v0.8.24-linux-arm-pi.tar.gz
sudo ln -s -f /opt/node/bin/node /usr/bin/node
sudo ln -s -f /opt/node/bin/npm /usr/bin/npm
rm -rf node-v0.8.24-linux-arm-pi.tar.gz

#node tools ( forever )
sudo npm install forever -g

#  ---------------------------------------------------------------------------
#  Configure alternative hostname
#  ---------------------------------------------------------------------------
#hostname pibeacon1
#ssh raspberrypi.local
#afp://pi@raspberrypi.local


#  ---------------------------------------------------------------------------
#  Final Configuration
#  ---------------------------------------------------------------------------
echo "provision.sh is done"
echo "cloning the piBeacon repo https://github.com/mschmulen/pibeacon to ~/piBeacon"
#cd ~/
#git clone https://github.com/mschmulen/pibeacon piBeacon
echo "running the piBeacon/raspberry-pi-scripts/configure.sh"
#cd ~/piBeacon/raspberry-pi-scripts/
#./configure.sh
#echo "configure.sh is done, reboot and enjoy!"
