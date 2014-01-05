#!/bin/bash
 
#---------------------------------------
# MongoDB Raspberry Pi
# Raspbian
# http://mongopi.wordpress.com/2012/11/25/installation/
#---------------------------------------
sudo su
sudo apt-get install git-core build-essential scons libpcre++-dev xulrunner-dev -y
sudo apt-get libboost-dev libboost-program-options-dev libboost-thread-dev libboost-filesystem-dev -y

cd ~/
git clone https://github.com/skrabban/mongo-nonx86
cd mongo-nonx86
scons
sudo scons --prefix=/opt/mongo install

#PATH=$PATH:/opt/mongo/bin/
#export PATH

