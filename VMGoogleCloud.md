sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -


## Run `sudo apt-get install -y nodejs` to install Node.js 10.x and npm
## You may also need development tools to build native addons:
 sudo apt-get install gcc g++ make
## To install the Yarn package manager, run:
 curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
 echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
 sudo apt-get update && sudo apt-get install yarn

## git
sudo apt-get install git
git --version


---
date: 2016-08-09
type: blog

seo_title: Deploying a Node.js App to DigitalOcean with SSL
description: >
  This step-by-step tutorial walks through the process of deploying a Node.js
  app to a DigitalOcean droplet with free SSL from Let’s Encrypt for $5/month.

title: >
  Tutorial: How to Deploy a Node.js App to DigitalOcean with SSL
subtitle: >
  Learn how to use DigitalOcean, Let’s Encrypt, and your big, sexy brain to
  deploy an SSL-enabled Node.js app for $5/month — in 30 minutes.

slug: deploy-nodejs-ssl-digitalocean

images:
- /images/nodejs-deploy-ssl-lets-encrypt.jpg

category:
- devops

tag:
- digitalocean
- nodejs
- letsencrypt
- server
- ssl

videoid: kR06NoSzAXY
repo_url: https://github.com/jlengstorf/tutorial-deploy-nodejs-ssl-digitalocean-app
---

import { Aside, Image } from '$components';

<Aside warning>

  **Heads up:** this post was written in 2016, and some of the tools and prices may have changed. The code _should_ still work, but you may want to look for a more up-to-date tutorial.

</Aside>

In this post, we'll walk through the process, from start to finish, of creating a new server, deploying a Node.js app, securing it (for free!) with an SSL certificate, and pointing a domain name to it.

Watch the video above to see the whole process live — with clever commentary, of course — or jump to just the bits you need in the write-up below.

## Prerequisites

- A domain name that you can modify DNS records for.
- A sense of adventure.

<Aside>

**NOTE:** This tutorial uses the command line. But don't be scurred. We'll get through this together.

</Aside>

## Set Up and Configure Your Server

Before we can do anything, we need a server that can be accessed publicly. There are lots of options out there, so don't feel locked into DigitalOcean — however, for this tutorial it'll probably be easiest to follow if you're using exactly the same setup.

<Aside>

If you don't have a DigitalOcean account, you can get $10 of credit — that's enough to run this app for two months — by signing up using this link: [claim your $10 in DigitalOcean credit](https://m.do.co/c/9d561578e13a).

</Aside>

### Create a new droplet on DigitalOcean.

To start [create an account on DigitalOcean](https://m.do.co/c/9d561578e13a), or [log into your existing account](https://cloud.digitalocean.com/login).

Once you're logged in, click the "Create Droplet" button at the top of your screen.

<Image caption="The DigitalOcean dashboard">

![The DigitalOcean dashboard.](images/nodejs-ssl-deploy-01.jpg)

</Image>

Choose the $5/month option with Ubuntu 16.04.1 x64. Select a region closest to your users.

<Image  caption="Creating a $5/month DigitalOcean droplet with Ubuntu 16.04.1.">

![Creating a $5/month DigitalOcean droplet with Ubuntu 16.04.1.](images/nodejs-ssl-deploy-02.jpg)

</Image>

Finally, add your SSH key and

#### How to find your SSH key

First, open Terminal[^windows] and check for existing SSH keys:

[^windows]:
    If you're on Windows, check out [Git Bash](https://git-scm.com/) for a way to run these commands on your computer.

```bash
ls -la ~/.ssh
```

If you already have SSH keys set up, you should see a file called `id_rsa.pub`. (If there's a file ending in `.pub`, it's very likely an SSH key.)

<Aside>

If you need to create an SSH key, use [GitHub's guide](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) to get yourself straightened out.

</Aside>

To copy your SSH key, use one of the following commands:

```bash
# This copies the key so you can paste with command + V
pbcopy < ~/.ssh/id_rsa.pub

# This prints it in the command line for manual copying
cat ~/.ssh/id_rsa.pub
```

#### Add your SSH key to the droplet

Back on the DigitalOcean droplet creation screen, click the "New SSH Key" button and paste your SSH key into the field that opens.

<Image  caption="Paste your SSH key into this field.">

![The SSH key field on the Digital Ocean dashboard.](images/nodejs-ssl-deploy-03.jpg)

</Image>

Click "Add SSH Key" to save it, then make sure it's selected, name your droplet, and hit the big "Create" button to get your server online.

<Image  caption="It takes a minute or so for the droplet to finish spinning up.">

![Droplet creating on the Digital Ocean dashboard.](images/nodejs-ssl-deploy-04.jpg)

</Image>

Your new droplet will display its IP address once it's set up. You can click on it to copy the IP to your clipboard.

<Image  caption="Click the IP address to copy it to your clipboard.">

![Droplet IP address on the Digital Ocean dashboard.](images/nodejs-ssl-deploy-05.jpg)

</Image>

#### Connect to the server using SSH

DigitalOcean droplets are created with a `root` user, and since we added our SSH keys, we can now log in without a password. Like magic!

```bash
# Make sure to replace the IP below with your server's IP address
ssh root@192.168.1.1
```

You will most likely be asked if you want to continue connecting the first time you log in. Type `yes` to continue, and you'll see something similar to the following:

```bash
$ ssh root@138.68.11.65
The authenticity of host '138.68.11.65 (138.68.11.65)' can't be established.
ECDSA key fingerprint is SHA256:f1qsLkumkNyRNfDVgjJk2R7kRlonuce1IMoEVTL2sfE.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '138.68.11.65' (ECDSA) to the list of known hosts.
Welcome to Ubuntu 16.04.1 LTS (GNU/Linux 4.4.0-31-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

0 packages can be updated.
0 updates are security updates.



The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

root@nodejs-ssl-deploy:~#
```

### Configure the server with basic security.

Once we're logged into the server, we need to get a few things configured to keep it secure.[^security]

[^security]:
    Keep in mind that this is _not_ a security tutorial, and these are bare minimum security measures. For a production app, consult a security specialist.

#### Create an SSH user

First, we're going to add a new user with `sudo` privileges. To do this, run the following command while logged into your droplet:

```bash
# You can choose any username you want here.
adduser jason
```

This command prompts us for a password, and then for some additional, optional details.

Afterward, we can see that our user has been created by running `id <your_username>`, which should output something like the following:

```bash
root@nodejs-ssl-deploy:~# id jason
uid=1000(jason) gid=1000(jason) groups=1000(jason)
```

<Aside>

**NOTE:** Make sure to save this password somewhere. It’s required for installing or modifying settings on the server later.

</Aside>

In order to run some of the commands on the server, such as restarting services, we need to add our new user to the `sudo` group. Do this by running the following command:

```bash
# Don't forget: use your own username here
usermod -aG sudo jason
```

Now if we run `id jason` we can see the `sudo` group has been applied.

```bash
root@nodejs-ssl-deploy:~# id jason
uid=1000(jason) gid=1000(jason) groups=1000(jason),27(sudo)
```

<Aside>

`sudo` is short for "superuser do". It's roughly equivalent to running a command as `root`.

</Aside>

#### Add your SSH key for the new user

Next, we need to add our SSH key to the new user. This allows us to log in without a password, which is important because we're planning to disable password logins for this server.

```bash
# Become the new user
su - jason

# Create a new directory for SSH stuff
mkdir ~/.ssh

# Set the permissions to only allow this user into it
chmod 700 ~/.ssh

# Create a file for SSH keys
nano ~/.ssh/authorized_keys
```

The `nano` editor allows us to copy-paste your SSH key — the same one we copied to DigitalOcean when we created the droplet — into the new file, then press `control + X` to exit. Type `Y` to save the file, and press `enter` to confirm the file name.

We can make sure the SSH key is saved by running `cat ~/.ssh/authorized_keys`; if the SSH key is printed in the terminal, it's been saved.

```bash
# Set the permissions to only allow this user to access it
chmod 600 ~/.ssh/authorized_keys

# Stop acting as the new user and become root again
exit
```

#### Disable password login

Since every server has a default `root` account that's a target for automated server attacks — and because that account has unlimited power inside the server — it's a good idea to make sure no one can use it.

<Aside>

There are other security benefits as well; check out [this discussion](http://security.stackexchange.com/questions/114721/why-is-disabling-root-necessary-for-security) if you want to climb down the rabbit hole.

</Aside>

After the previous step, you should be logged into your server as `root`. Let's make sure the new account works and has `sudo` access:

```bash
# Log out of the server as root
exit

# Log into your server as the new user
ssh jason@138.68.11.65
```

Inside, we need to update the SSH configuration to disable password logins, and to disable logging in as `root` altogether.

To do this, use the following command to open the SSH configuration file for editing:

```bash
sudo nano /etc/ssh/sshd_config
```

<Aside>

**NOTE:** You will be asked for a password when you use the `sudo` command. This is the password you used when you created the user earlier in this tutorial.

</Aside>

Inside, you need to update two settings:

1. Find `PermitRootLogin yes` and change it to `PermitRootLogin no`
2. Find `#PasswordAuthentication yes` and change it to `PasswordAuthentication no`

<Aside>

**TIP:** There's a quick way in `nano` to find those settings: press `control + W` to search for text. Otherwise, you can just press the down arrow until you see the settings that need to change.

</Aside>

<Aside>

**IMPORTANT:** Make sure to remove the `#` before `PasswordAuthentication`; that's used to comment out the setting, which means it won't be applied.

</Aside>

Save the file by pressing `control + X`, then `Y`, then `enter`.

Finally, restart the SSH service with this command:

```bash
# Reloads the configuration we just changed
sudo systemctl reload sshd
```

Test your login by opening a new tab in Terminal (`command + T` on Mac) and logging into your server again.

If we log in as our new user, everything works as expected. However, if we try to log in as `root`, we get an error:

```
$ ssh root@138.68.11.65
Permission denied (publickey).
```

#### Set up a basic firewall

Next, we're going to configure a simple firewall. We're going to configure it to deny all traffic except through standard web traffic ports (`80` for HTTP, and `443` for HTTPS), and to allow SSH logins.

This, in theory at least, should eliminate a lot of security risks on our server. (But again — this is _not_ a security article; these are just basic precautions.)

We're going to run three commands to configure the firewall — called `ufw` — and then we'll enable it. Enter the following while logged into the server:

```bash
# Enable OpenSSH connections
sudo ufw allow OpenSSH

# Enable HTTP traffic
sudo ufw allow http

# Enable HTTPS traffic
sudo ufw allow https

# Turn the firewall on
sudo ufw enable
```

<Aside>

When you enable `ufw`, you'll get a notice that enabling the firewall might disrupt your connection. Don't worry about that — you've enabled SSH connections.

</Aside>

To check the status of the firewall, run `sudo ufw status`, which will give you the following:

```
jason@nodejs-ssl-deploy:~$ sudo ufw status
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
80                         ALLOW       Anywhere
443                        ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
80 (v6)                    ALLOW       Anywhere (v6)
443 (v6)                   ALLOW       Anywhere (v6)
```

## Get Your App Up and Running

Now that the server is set up, we can get our app installed.

### Install Git.

In order to get a copy of our app to this server, we're going to use [Git](https://git-scm.com/). Fortunately, Ubuntu makes it really easy to install common tools, so all we need to do is run this command:

```bash
sudo apt-get install git
```

We can validate that Git was installed properly by running `git --version`:

```bash
jason@nodejs-ssl-deploy:~$ git --version
git version 2.7.4
```

### Set up Node.js.

Node.js is a little more complex than Git, because there are several different versions of Node that are used in production environments. Therefore, we need to update `apt-get` with the right version for our app before we install it.

#### Tell `apt-get` which Node.js version to download

The folks at [NodeSource](https://github.com/nodesource/distributions) have made it really easy to install our desired Node version. For this tutorial, we'll be using the latest `6.x` release.

Run the following commands to download and execute the setup script:

```bash
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
```

<Aside>

This is a complex command, but essentially it uses `curl` to download the setup script, then _pipes_ (using `|`) the downloaded script to the next command, `bash`, which actually executes it.

</Aside>

This takes a few seconds to complete.

#### Install Node.js v6.x

With the NodeSource script complete, we can simply use `apt-get` to install Node.js:

```bash
sudo apt-get install nodejs
```

<Aside>

You may get a notice asking if you want to continue. Press `enter` to continue the installation.

</Aside>

Once it's complete, we can verify that `node` is available by running `node --version`:

```bash
jason@nodejs-ssl-deploy:~$ node --version
v6.3.1
```

#### Clone the app

Now we can actually clone a copy of our app to the server — things are really getting exciting now.

<Aside>

**NOTE:** If you don't have a Node app ready to deploy, you can use the [simple demo app](https://github.com/jlengstorf/tutorial-deploy-nodejs-ssl-digitalocean-app) that was created for this tutorial.

</Aside>

It doesn't matter where you install the app, so let's create an `apps` dir in our user's home folder and clone the app into a folder named after our domain — this makes it really easy to remember which app is which.

```bash
# Make sure you’re in your home folder
cd ~

# Create the new directory and move into it
mkdir apps
cd apps/

# Clone your app into a new directory named for your domain
git clone https://github.com/jlengstorf/tutorial-deploy-nodejs-ssl-digitalocean-app.git app.example.com
```

<Aside>

**NOTE:** Make sure to replace `app.example.com` with your desired domain name.

</Aside>

#### Test the app

To make sure your app is installed and working, move into the new folder and start it:

```bash
# Move into the app directory
cd app.example.com

# Start the app
node app
```

<Aside>

**NOTE:** The example app's main file is at `app/index.js`. You'll need to adjust your start command depending on how your app is set up.

</Aside>

The example app listens at `http://localhost:5000`, so we can test if it's working by opening a new Terminal session, logging into our server, and making a `curl` request to the app.

```bash
jason@nodejs-ssl-deploy:~$ curl http://localhost:5000/
<h1>I’m a Node app!</h1><p>And I’m <em>sooooo</em> secure.</p>
```

<Aside>

Since the app is running on `localhost`, it can only be reached from the server itself. We'll correct that later on.

</Aside>

Awesome — we have a running app. Now we just need to make it accessible to the outside world.

We can `exit` from the test session (the one we just ran the `curl` command in), and we can stop the app in our other session using `control + C`.

## Start Your App Using a Process Manager

Simply starting the app manually is _technically_ enough to get the app deployed, but if the server restarts, that means we have to manually start the app again.

And in production apps, we want to eliminate as many — if not all — manual steps to get the app deployed. So we're going to use a process manager called [PM2](http://pm2.keymetrics.io/) to run our app. This also gives us benefits like easy-to-access logs, and a simple way to start, stop, and restart the app.

PM2 also allows us to start the app automatically when the server restarts, which means one less thing we need to worry about.

### Install PM2

Unlike the other tools we've installed, `pm2` is a Node package. We install it using the `npm` command, which is the default package manager for Node.js.

```bash
sudo npm install -g pm2
```

<Aside>

Using `-g` means that `pm2` is available globally, which is necessary for it to work properly.

</Aside>

### Start your app using PM2

With PM2 installed, we can now start the app like this:

```bash
# Make sure you're in the app directory
cd ~/apps/app.example.com

# Start the app with PM2
pm2 start app
```

<Aside>

**NOTE:** You call `pm2 start` with the same argument you'd use to start the app with `node`. If you start the app with `node index.js`, you'd run `pm2 start index.js` here.

</Aside>

Once the app is started, we see the status displayed:



And, conveniently, the app is running without locking up our session. In the same session we're able to run `curl http://localhost:5000` to make sure it's running properly:

```
jason@nodejs-ssl-deploy:~/apps/app.example.com$ curl http://localhost:5000/
<h1>I’m a Node app!</h1><p>And I’m <em>sooooo</em> secure.</p>
```

### Start your app automatically when the server restarts

We're _almost_ done with getting the app running — just one more step.

The last thing to do is to make sure that when the server restarts, PM2 starts our app again.

This is a two-step process, which we kick off by running `pm2 startup systemd`:

```
jason@nodejs-ssl-deploy:~/app.example.com$ pm2 startup
[PM2] You have to run this command as root. Execute the following command:
      sudo su -c "env PATH=$PATH:/usr/bin pm2 startup systemd -u jason --hp /home/jason"
```

PM2 prints out a command that we need to run using `sudo`. Copy-paste that to finish the process.

```bash
sudo su -c "env PATH=$PATH:/usr/bin pm2 startup systemd -u jason --hp /home/jason"
```

This will step through the process of updating the server to run PM2 on startup, and then you're all set.

Now we've got a running app — in the next section, we'll make the app securely accessible to the rest of the world!

## Get a Free SSL Certificate With Let's Encrypt

SSL was a big hurdle for a long time for two reasons:

1. It was expensive.
2. It was hard.

Fortunately, some very smart, very kind-hearted people created [Let's Encrypt](https://letsencrypt.org/), which is:

1. Free
2. Easy

So now there's really no excuse not to set up SSL for our domains.

### Install Let's Encrypt

To start, we need to install some tools that Let's Encrypt depends on, then clone the `letsencrypt` repository to our server.

```bash
# Install tools that Let’s Encrypt requires
sudo apt-get install bc

# Clone the Let’s Encrypt repository to your server
sudo git clone https://github.com/letsencrypt/letsencrypt /opt/letsencrypt
```

### Configure your domain to point to the server

<Aside>

**IMPORTANT:** This has to be done before Let's Encrypt will create a certificate. If your DNS isn't set up correctly, Let’s Encrypt will complain and then fail.

</Aside>

Log into your DNS provider. I use CloudFlare; you'll want to log into whichever service you either bought your domain name through (Namecheap and GoDaddy, for example), or the service you use to manage your DNS (such as CloudFlare or DNSimple).

Add an A record for your domain that points to your droplet's IP address.

To check that the domain is pointing to your droplet, run the following (make sure to replace `app.example.com` with the domain you just configured):

```bash
dig +short app.example.com
# output should be your droplet’s IP address, e.g. 138.68.11.65
```

### Generate the SSL certificate.

Now that the domain is pointed to our server, we can generate the SSL certificate:

```bash
# Move into the Let’s Encrypt directory
cd /opt/letsencrypt

# Create the SSL certificate
./certbot-auto certonly --standalone
```

The tool will run for a while to initialize itself, and then we'll be asked for an admin email address, to agree to the terms, and to specify our domain name or names. Once that's done, the certificate will be stored on the server for use with our app.

For now, that's all we need. We'll come back to these in a minute when we configure the domain.

<Aside>

**NOTE:** If you want to support multiple subdomains (e.g. `example.com` and `www.example.com`), you'll need to specify them during the setup as a comma-separated list: `example.com,www.example.com`

</Aside>

### Setup auto-renewal for the SSL certificate

For security, Let’s Encrypt certificates expire every 90 days, which seems pretty short. (By contrast, most paid SSL certificates are valid for at least a year.)

It turns out, though, that Let’s Encrypt has an one-step command to renew certificates:

```bash
/opt/letsencrypt/certbot-auto renew
```

This command checks if the certificate is near its expiration date and, when necessary, it generates an updated certificate that's good for another 90 days.

Now, it would be a _huge_ pain in the ass if we had to manually log into the server and renew the certificate four times a year — and most likely we'd end up forgetting at least once — so we're going to use a built-in tool called [`cron`](http://www.unixgeeks.org/security/newbie/unix/cron-1.html) to handle the renewal automatically.

To set this up, run the following command in the terminal to edit the server's `cron` jobs:

```bash
sudo crontab -e
```

We get an option for which editor to use here. Since `nano` is easier than the others, we'll stick with that.

When the editor opens, head to the bottom of the file and add the following two lines:

```bash
00 1 * * 1 /opt/letsencrypt/certbot-auto renew >> /var/log/letsencrypt-renewal.log
30 1 * * 1 /bin/systemctl reload nginx
```

The first line tells `cron` to run the renewal command, with the output logged so we can check on it when necessary, every Monday at 1 in the morning.

The second restarts NGINX — which we haven't set up yet, so don't worry — at 1:30 to make sure the new cert is being used.

Save and exit by pressing `control + X`, then `Y`, then `enter`.

<Aside>

**NOTE:** The command to reload `nginx` doesn't do anything right now. We'll be installing and configuring NGINX in the next section.

</Aside>

That's it for the SSL cert. The last thing left is to make your app accessible by visiting our domain name in a browser.

## Point Your Domain to the App

In order to make our app accessible, we need to send visitors to our domain to our app. To do this, we'll be using [NGINX](https://www.nginx.com/) as a [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy) because it's faster and less painful than handling it through Node.js.

### Install NGINX

Installing NGINX is no different from most of the other tools we've downloaded so far. Use `apt-get` to download and install it:

```bash
sudo apt-get install nginx
```

#### Make sure all traffic is secure

Next, we need to make sure that all traffic is served over SSL. To do this, we'll add a redirect for any non-SSL traffic to the SSL version. That way, if someone visits `http://app.example.com`, they'll be automatically redirected to `https://app.example.com`.

To do this, we need to edit NGINX's configuration files. Run the following command to open the file for editing:

```bash
sudo nano /etc/nginx/sites-enabled/default
```

Inside, delete everything and add the following:

```bash:title=/etc/nginx/sites-enabled/default
# HTTP — redirect all traffic to HTTPS
server {
    listen 80;
    listen [::]:80 default_server ipv6only=on;
    return 301 https://$host$request_uri;
}
```

Save and exit by pressing `control + X`, then `Y`, then `enter`.

#### Create a secure Diffie-Hellman Group

It only takes a couple extra minutes to create a _really_ secure SSL setup, so we might as well do it. One of the ways to do that is to use a strong [Diffie-Hellman group](https://supportforums.cisco.com/document/6211/diffie-hellman-dh), which helps ensure that our secure app _stays_ secure.

Run the following command on your server:

```bash
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
```

This takes a minute or two — encryption should be hard for computers — and when it's done we can move on for now. We'll use this file in the next section.

#### Create a configuration file for SSL

Since I'm not a security expert, we're going to defer to an [actual security expert](https://raymii.org/s/) for NGINX's SSL settings.

We need to create a new file on our server to hold these settings — if we add another domain to this server, we can reuse them this way — which we'll do with the following command:

```bash
sudo nano /etc/nginx/snippets/ssl-params.conf
```

Inside, we can copy-paste the following settings.

```bash:title=/etc/nginx/snippets/ssl-params.conf
# See https://cipherli.st/ for details on this configuration
ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
ssl_prefer_server_ciphers on;
ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
ssl_ecdh_curve secp384r1; # Requires nginx >= 1.1.0
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off; # Requires nginx >= 1.5.9
ssl_stapling on; # Requires nginx >= 1.3.7
ssl_stapling_verify on; # Requires nginx => 1.3.7
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;

# Add our strong Diffie-Hellman group
ssl_dhparam /etc/ssl/certs/dhparam.pem;
```

Save and exit by pressing `control + X`, then `Y`, then `enter`.

<Aside>

**NOTE:** The `resolver` parameter is set to Google's DNS resolvers. This is part of [OCSP stapling](https://en.wikipedia.org/wiki/OCSP_stapling), which is a way to speed up certificate validation. If you have your own DNS resolver, you can update that value.

</Aside>

#### Configure your domain to use SSL

This is the last configuration step, I promise.

Now that we've got a certificate, a strong Diffie-Hellman group, and a secure SSL configuration, all that's left to do is actually set up the reverse proxy.

Open the site configuration again:

```bash
sudo nano /etc/nginx/sites-enabled/default
```

Inside, add the following below the block we added earlier:

```bash:title=/etc/nginx/sites-enabled/default
# HTTPS — proxy all requests to the Node app
server {
    # Enable HTTP/2
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name app.example.com;

    # Use the Let’s Encrypt certificates
    ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;

    # Include the SSL configuration from cipherli.st
    include snippets/ssl-params.conf;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://localhost:5000/;
        proxy_ssl_session_reuse off;
        proxy_set_header Host $http_host;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
    }
}
```

Save and exit by pressing `control + X`, then `Y`, then `enter`.

This configuration listens for connections to our domain on port `443` (the HTTPS port), uses the certificate we generated to secure the connection, and then proxies our app's output out to the browser.

<Aside>

**IMPORTANT:** Don't forget to replace all instances of `app.example.com` in the configuration details above with your domain name!

</Aside>

Before we start the server, we should test the NGINX configuration with `sudo nginx -t`. If we didn't make any typos and everything looks good, we'll get the following:

```
jason@nodejs-ssl-deploy:~$ sudo nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

#### Enable NGINX

The very last step in this process is to start NGINX.

```bash
sudo systemctl start nginx
```

## Test Your App

And now: the big moment. We can now visit our domain in a browser, and we'll see our app.

<Aside>

**NOTE:** In some cases, you may see the "Welcome to nginx!" screen instead of your app. If that happens, restart Nginx with `sudo systemctl restart nginx`, then hard refresh your browser (`command` + `shift` + `R` on Mac) to see the live app.

</Aside>

<Image caption="Look at that sexy green lock!">

![Working app with green SSL verification in the address bar.](./images/nodejs-ssl-deploy-07.jpg)

</Image>

The configuration steps get pretty mind-numbing toward the end, but there's a huge payoff: we can now bask in the glory of a server that took about 30 minutes to set up, costs $5/month, and —  as a bonus — gets [an A+ for SSL security](https://www.ssllabs.com/ssltest/index.html).

<Image caption="Our app's SSL rating.">

![A+ rating on Qualys SSL Labs report.](./images/nodejs-ssl-deploy-08.jpg)

</Image>

Not bad for 30 minutes' worth of setup, right?

## Additional Resources

- [Common firewall rules and commands](https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands)
- [How to configure NGINX as a reverse proxy for subdomains](https://whatididtodowhatidid.wordpress.com/2014/03/14/subdomains-for-ports-on-same-ubuntu-server-with-nginx-reverse-proxy/)
- [Setting up a Ubuntu 16.04 server with a new user and a basic firewall](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04)
- [DigitalOcean's guide to setting up a Node.js app for production](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)
- [Securing NGINX with Let's Encrypt](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04)