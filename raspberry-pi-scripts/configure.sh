#!/bin/sh

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

echo "restart"
sudo reboot

