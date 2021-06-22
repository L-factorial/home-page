#!/bin/bash

#download node and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node

#create our working directory if it doesnt exist
DIR="/home/ec2-user/lfactorial-home-page"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} directory"
  mkdir ${DIR}
fi

# installing nginx
yum update -y
amazon-linux-extras  install nginx1.12
nginx -v 

sudo chmod 2775 /usr/share/nginx/html
sudo find /usr/share/nginx/html -type d -exec chmod 2775 {} \;
sudo find /usr/share/nginx/html -type f -exec chmod 0664 {} \;

sudo rm -r /usr/share/nginx/html/*
sudo cp -r /home/ec2-user/lfactorial-home-page/front-end/build/. /usr/share/nginx/html
sudo systemctl start nginx
sudo systemctl enable nginx



