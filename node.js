sudo apt-get install nodejs
sudo apt-get install npm
sudo apt-get install nodejs-legacy

sudo chown -R `whoami` ~/.npm
sudo chown -R $USER /usr/local

curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs


#INSTALACION PM2
npm install pm2 -g
pm2 resurrect  		//RECARGA LOS ARCHIVOS DE INICIO
pm2 start app.js --watch  //START APP CON WATCH