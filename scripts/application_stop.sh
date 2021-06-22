#!/bin/bash
#Stopping existing node servers
echo "Stopping any existing node servers"
pkill node
echo "Stopping any existing nignx servers"
sudo systemctl stop nginx