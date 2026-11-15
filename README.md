# Dungeon Duo — Online Server

Play Dungeon Duo 3D together from two different computers.
The host's browser runs the game. This small Node.js server just serves the game page and passes messages between the two players.

## Run it on your own computer (to test)
1. Install Node.js 18 or newer from https://nodejs.org
2. In this folder run:
   ```
   npm install
   npm start
   ```
3. Open http://localhost:3000 — press **H** to host. On a second computer **on the same Wi-Fi**, open `http://<your-computer's-IP>:3000`, press **J** and type the code.

## Put it online (free) — Render.com
1. Put these 4 files in a GitHub repository (github.com → New repository → upload files): `index.html`, `server.js`, `package.json`, `README.md`.
2. Go to https://render.com → sign up → **New → Web Service** → connect that repository.
3. Settings: **Runtime:** Node · **Build command:** `npm install` · **Start command:** `npm start` · **Instance type:** Free.
4. Click **Create Web Service**. After a minute you get a link like `https://dungeon-duo.onrender.com`.
5. Both players open that link. One presses **H (Host Online)** and reads out the 4-letter code; the other presses **J (Join Online)** and types it.

Note: free Render servers fall asleep after ~15 minutes without visitors; the first visit after that takes ~30–60 seconds to wake up.

## Controls online
Both players use: W/S move · A/D turn · Q/E strafe · R/V aim up/down · F shoot/open chest · G gun↔sword · Shift crouch · Space jump · X throw grenade · 1-4 take a chest item.
