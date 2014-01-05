#!/bin/bash
 
#---------------------------------------
# Node.JS Raspberry Pi Package builder
# Raspbian
#---------------------------------------

#node 
echo "Install Node by compiling from source"
#sudo apt-get update && sudo apt-get -y install build-essential nodejs nodejs-legacy npm
wget http://nodejs.org/dist/v0.10.18/node-v0.10.22.tar.gz
tar -zxf node-v0.10.22.tar.gz
cd node-v0.10.22
./configure
make
sudo make install
#rm -rf node-v0.10.22.tar.gz




