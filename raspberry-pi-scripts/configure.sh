#!/bin/sh

#  ---------------------------------------------------------------------------
#  Configure piBeacon
#  ---------------------------------------------------------------------------
cd ~/piBeacon
echo "init.d - piBeacon Commands"
#sudo update-rc.d -f piBeacon remove
sudo cp raspberry-pi-scripts/commands/piBeacon /etc/init.d/
sudo chmod 755 /etc/init.d/piBeacon
sudo update-rc.d piBeacon defaults
# test with /etc/init.d/piBeacon start

#  ---------------------------------------------------------------------------
#  iBeaconAdvertise
#  ---------------------------------------------------------------------------
cd ~/piBeacon
echo "init.d - piBeacon Commands"
#sudo update-rc.d -f iBeaconAdvertise remove
sudo cp raspberry-pi-scripts/commands/iBeaconAdvertise /etc/init.d/
sudo chmod 755 /etc/init.d/iBeaconAdvertise
sudo update-rc.d iBeaconAdvertise defaults
# test with /etc/init.d/iBeaconAdvertise start

#  ---------------------------------------------------------------------------
#  Configure XServer as a Kiosk lightdm.conf
#  ---------------------------------------------------------------------------
cd ~/piBeacon
echo "update lightdm.conf to prevent screen blanking"
#Prevent screen blanking, this can be done manually as well
	#edit /etc/lightdm/lightdm.conf
	#add a line “xserver-command=X -s 0 dpms” under [SeatDefaults]
sudo cp raspberry-pi-scripts/configs/lightdm.conf /etc/lightdm

#  ---------------------------------------------------------------------------
#  Configure LXDE autostart
#  ---------------------------------------------------------------------------
cd ~/piBeacon
echo "update LXDE autostart script"
sudo cp raspberry-pi-scripts/configs/autostart /etc/xdg/lxsession/LXDE

#npm install the piBeacon-kiosk
  #cd ~/piBeacon/piBeacon-kiosk
  #sudo rm -rf node_modules
  #npm update
  #sudo sudo npm install

#  ---------------------------------------------------------------------------
#  Start the services
#  ---------------------------------------------------------------------------
#/etc/init.d/piBeacon start
#/etc/init.d/iBeaconAdvertise start

#  ---------------------------------------------------------------------------
#  Configure piBeacon
#  ---------------------------------------------------------------------------
sleep 20s

#echo "Navigate to http://$(hostname).local$PORT_USED to use the piBeacon dashboard"

echo "restart"
#sudo reboot
