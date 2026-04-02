# PocketBase Setup Guide

Hey Taya! Here's how to get your own private sync server running. This replaces Firebase completely. Your data stays on YOUR server, encrypted, no Google involved.

## What is PocketBase?

It's a tiny open-source server (one single file!) that handles user accounts and data storage. You run it on a cheap cloud server and your app talks to it instead of Firebase. It's free, private, and you own everything.

## Cost

$3-5/month for a small VPS (virtual private server). That's it. Providers to consider:
- **DigitalOcean** ($4/mo droplet) — simple, beginner-friendly
- **Hetzner** ($3.29/mo) — cheapest good option, based in Europe (extra privacy)
- **Oracle Cloud** (free tier) — actually free forever for their smallest server

## Step-by-step Setup

### 1. Get a VPS

Pick one of the providers above. You want the smallest/cheapest Linux server (Ubuntu 22.04). You'll get an IP address and SSH access.

### 2. Install PocketBase on the server

SSH into your server and run:

```bash
# Download PocketBase (check pocketbase.io for latest version)
wget https://github.com/pocketbase/pocketbase/releases/download/v0.23.5/pocketbase_0.23.5_linux_amd64.zip
unzip pocketbase_0.23.5_linux_amd64.zip

# Start it
./pocketbase serve --http=0.0.0.0:8090
```

### 3. Set up your admin account

Open your browser and go to: `http://YOUR-SERVER-IP:8090/_/`

This is the PocketBase admin panel. Create your admin account with taya@gardenfaery.love.

### 4. Create the app_sync collection

In the admin panel:
1. Click "Collections" in the sidebar
2. Click "New Collection"
3. Name it: `app_sync`
4. Add these fields:
   - `user` — type: Relation (to the "users" collection, single)
   - `appState` — type: Plain text (no max length, or set it very high like 10000000)
   - `lastModified` — type: Plain text
5. Click "Create"

### 5. Set up API rules for app_sync

Click on the `app_sync` collection, then the gear icon for settings. Set these rules:
- **List/Search rule:** `user = @request.auth.id`
- **View rule:** `user = @request.auth.id`
- **Create rule:** `user = @request.auth.id`
- **Update rule:** `user = @request.auth.id`
- **Delete rule:** `user = @request.auth.id`

This means each user can only see and edit their own data.

### 6. Create your user account

In the admin panel, go to "Users" (the built-in auth collection) and create a user:
- Email: taya@gardenfaery.love
- Password: (pick something strong!)

### 7. Connect the app

Open Garden Faery Books on your phone or desktop:
1. Go to Settings tab
2. Scroll to "Cloud Sync"
3. Enter your server URL: `http://YOUR-SERVER-IP:8090`
4. Enter your email and password
5. Click "Save Config" then "Sign In"

You should see "Connected" and it'll pull/push your data!

### 8. (Optional but recommended) Add HTTPS

For security, set up HTTPS with a free Let's Encrypt certificate. PocketBase can handle this automatically if you point a domain at it:

```bash
./pocketbase serve --http=0.0.0.0:80 --https=0.0.0.0:443
```

You could even use a subdomain like `sync.gardenfaery.love` by adding an A record in Porkbun.

### 9. Keep it running

To keep PocketBase running after you close your SSH session:

```bash
# Create a system service
sudo nano /etc/systemd/system/pocketbase.service
```

Paste this:
```
[Unit]
Description=PocketBase
After=network.target

[Service]
Type=simple
User=root
ExecStart=/root/pocketbase serve --http=0.0.0.0:8090
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable pocketbase
sudo systemctl start pocketbase
```

Now it'll start automatically even after server reboots.

## What about my existing Firebase data?

Your data is already in localStorage on both devices. When you first sign in to PocketBase, the app will detect there's no cloud data yet and push your local data up. So you won't lose anything.

After everything works, you can:
1. Delete the Firebase project at console.firebase.google.com
2. Remove the old `firebaseConfig` from your browser's localStorage (the app handles this automatically on sync)

## Need help?

This is a one-time setup. Once it's running, it just works. If you run into trouble, bring the error message to our next session and I'll walk you through it.
