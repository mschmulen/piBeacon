#!/bin/bash
 
#---------------------------------------
# Node.JS Raspberry Pi Package builder
# Raspbian
#---------------------------------------

#node 
echo "Install Node"
#sudo apt-get update && sudo apt-get -y install build-essential nodejs nodejs-legacy npm  
wget http://nodejs.org/dist/v0.10.18/node-v0.10.22.tar.gz
tar -zxf node-v0.10.22.tar.gz
cd node-v0.10.22
./configure
make
sudo make install
#rm -rf node-v0.10.22.tar.gz


#wget http://nodejs.org/dist/v0.8.22/node-v0.8.22-linux-arm-pi.tar.gz
#sudo tar -C /opt/node --strip=1 -zxvf node-v0.8.22-linux-arm-pi.tar.gz
#sudo ln -s -f /opt/node/bin/node /usr/bin/node
#sudo ln -s -f /opt/node/bin/npm /usr/bin/npm



