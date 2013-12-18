#!/bin/bash
 
#---------------------------------------
# Node.JS Raspberry Pi Package builder
# Raspbian
# http://nodejs-news.com
#---------------------------------------
 
echo "-> Getting fpm (Effing package managers) Ruby gem"
sudo gem install fpm --no-ri --no-rdoc
echo "-> Getting latest node.js version"
result=$(wget -qO- http://nodejs.org/dist/latest/ | egrep -o 'node-v[0-9\.]+-linux-arm-pi.tar.gz' | tail -1)
tmp=$(echo $result | egrep -o 'node-v[0-9\.]+')
mm=$(echo $result | egrep -o '[0-9\.]+')
majorminor=${mm:0:${#mm} - 4}
version=${tmp:0:${#tmp}}
if [ ! -e $result ]; then
      echo "-> Downloading $result"
      wget -q http://nodejs.org/dist/latest/$result
      echo "-> End of Download $result"
      tar xzf $result
      ln -s $version-linux-arm-pi node
      cd node
      mkdir -p usr
      mv bin lib share usr
      echo "-> Building node.js Debian package"
      fpm -s dir -t deb -n nodejs -v "$majorminor-1vr~wheeze1" --category web -m "Vincent RABAH <vincent.rabah@gmail.com>" --vendor "NodeJS-News.com" --url http://nodejs.org/ \
      --description "Node.js event-based server-side javascript engine." \
      -C . -a armhf  -p "../nodejs_$majorminor-1vr~wheezy1_armhf.deb"  usr/
      cd ..
   else
      echo "You already have the latest node.js version : $version"
fi

