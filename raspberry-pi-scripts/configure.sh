#!/bin/sh
	
cd ~/piBVeacon
echo "init.d - piBeacon Commands"
#sudo update-rc.d -f piBoard remove
sudo cp raspberry-pi-scripts/commands/piBeacon /etc/init.d/
sudo chmod 755 /etc/init.d/piBeacon
sudo update-rc.d piBeacon defaults
# test with /etc/init.d/piBeacon start

echo "update LXDE autostart script"
sudo cp raspberry-pi-scripts/autostart /etc/xdg/lxsession/LXDE

echo "restart"
sudo reboot

