#!/bin/bash

#give permission for everything in the express-app directory
sudo chmod -R 777 /home/ec2-user/lfactorial-home-page

#navigate into our working directory where we have all our github files
cd /home/ec2-user/lfactorial-home-page

#add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)



# installing nginx
#yum update -y
#sudo amazon-linux-extras  install nginx1.12
#nginx -v 

#sudo chmod 777 /usr/share/nginx/html
#sudo find /usr/share/nginx/html -type d -exec chmod 2775 {} \;
#sudo find /usr/share/nginx/html -type f -exec chmod 0664 {} \;

sudo rm -r /usr/share/nginx/html/*
sudo cp -r /home/ec2-user/lfactorial-home-page/front-end/build/. /usr/share/nginx/html
sudo systemctl start nginx
#sudo systemctl enable nginx


#install node modules
npm install

#start our node app in the background
node server.js > server.out.log 2> server.err.log < /dev/null & 


