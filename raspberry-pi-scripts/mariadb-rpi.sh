#!/bin/bash
 
#---------------------------------------
# MariaDB Raspberry Pi
# Raspbian
# http://www.raspberrypi.org/phpBB3/viewtopic.php?t=12859&p=288820
#---------------------------------------
sudo su
wget "https://downloads.mariadb.org/interstitial/mariadb-5.5.34/kvm-tarbake-jaunty-x86/mariadb-5.5.34.tar.gz/from/http://download.nus.edu.sg/mirror/mariadb"
tar -xvf mariadb
mv mariadb-5.5.34 maria
cd maria/BUILD
./autorun.sh
cd ..
aptitude install cmake libncurses5-dev bison
./configure
make
make install

adduser mysql
chown -R mysql /usr/local/mysql
cd /usr/local/mysql
scripts/mysql_install_db --user=mysql
cp support-files/mysql.server /etc/init.d/mysqld
/etc/init.d/mysqld start

./bin/mysql_secure_installation

#hit enter
#make a password
#choice options to your liking
#cp /usr/local/mysql/support-files/my-medium.cnf /etc/mysql/my.cnf
#exit



