#!/bin/sh
#curl https://raw.github.com/mschmulen/pibacon/scripts/provision.sh | sudo sh

# ------------------------

#http://stackoverflow.com/a/6946864/629189
# translate long options to short
OFFLINE=false
GITHUB=false

for arg
do
    delim=""
    case "$arg" in
       --offline) args="${args}-o ";;
       --github) args="${args}-g ";;
       --help) args="${args}-h ";;
       #--config) args="${args}-c ";;
       # pass through anything else
       *) [[ "${arg:0:1}" == "-" ]] || delim="\""
           args="${args}${delim}${arg}${delim} ";;
    esac
done
# reset the translated args
eval set -- $args
# now we can process with getopt
while getopts ":hogvc:" opt; do
    case $opt in
        h)  usage ;;
        o)  OFFLINE=true ;;
        g)  GITHUB=true ;;
        #c)  source $OPTARG ;;
        #\?) usage ;;
        :)
        echo "option -$OPTARG requires an argument"
        usage
        ;;
    esac
done

echo "$OFFLINE"


# ------------------------
#set -e
#PIBEACON_ROOT="/usr/share/piBeacon"
#mkdir -p "$PIBEACON_ROOT"

# ------------------------

#Check if port 80 is in use, use 3000 if so.
#PORT_USED=""
#if netstat -lnt | awk '$6 == "LISTEN" && $4 ~ ".80"' | grep -q "LISTEN"
#then
#  redis-cli HMSET server port 8080
#  PORT_USED=":8080"
#  echo "**** WARNING: PORT 80 IN USE. FALLING BACK TO 8080. ****"
#  echo "**** TO CHOOSE A DIFFERENT PORT USE THE FOLLOWING COMMAND: ****"
#  echo "**** redis-cli HMSET server port 8080 ****"
#  echo "**** AND RESTART THE SERVER ****"
#fi

#if $OFFLINE
#then
#  redis-cli HMSET server offline 1
#fi

#if $GITHUB
#then
#  redis-cli HMSET server github 1
#fi

# ------------------------


cd ~/piBeacon
echo "init.d - piBeacon Commands"
#sudo update-rc.d -f piBoard remove
sudo cp raspberry-pi-scripts/commands/piBeacon /etc/init.d/
sudo chmod 755 /etc/init.d/piBeacon
sudo update-rc.d piBeacon defaults
# test with /etc/init.d/piBeacon start

#additional configure XServer as a Kiosk, Prevent screen blanking
		#edit /etc/lightdm/lightdm.conf
		#add a line “xserver-command=X -s 0 dpms” under [SeatDefaults]
echo "update lightdm.conf to prevent screen blanking"
sudo cp raspberry-pi-scripts/lightdm.conf /etc/lightdm

echo "update LXDE autostart script"
sudo cp raspberry-pi-scripts/autostart /etc/xdg/lxsession/LXDE

#npm install the piBeacon-kiosk
cd ~/piBeacon/piBeacon-kiosk
rm -rf node_modules
#npm update
sudo npm install

#start the node-angular-display-server
/etc/init.d/piBeacon start

#sleep 20s

#echo "Navigate to http://$(hostname).local$PORT_USED to use the piBeacon dashboard"

echo "restart"
sudo reboot

