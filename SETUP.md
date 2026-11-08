# Reverie SMP — Setup Guide

## Requirements
- Node.js 20+
- pnpm (`npm i -g pnpm`) or npm
- PM2 (`npm i -g pm2`) for keeping the site running in the background

---

## 1. Configure `.env`

All settings and credentials live directly in the `.env` file in the root folder (`reverie/.env`). 

To create or edit it:
```bash
# If .env does not exist, copy the template:
cp .env.example .env

# Edit with nano or your preferred editor:
nano .env
```

Your `.env` file should look like this:

```env
# ── Admin Panel Authentication ──────────────────────────────────────────────
# Required: Strong password for the owner account at /adminpanel
ADMIN_PASSWORD=NORMALITY3_

# Optional: Owner username displayed on the login form (defaults to "admin")
ADMIN_USERNAME=Stratoukos

# ── Site URL ────────────────────────────────────────────────────────────────
# Required for Discord OAuth callbacks and absolute links
SITE_URL=https://reveriesmp.indevs.in
NEXT_PUBLIC_SITE_URL=https://reveriesmp.indevs.in

# ── Discord OAuth2 (Connect Account & Tickets) ───────────────────────────────
# Get these from https://discord.com/developers/applications
DISCORD_CLIENT_ID=your-client-id-here
DISCORD_CLIENT_SECRET=your-client-secret-here
```

### Discord Developer Portal Setup:
1. Go to [Discord Developer Portal](https://discord.com/developers/applications) and click **New Application** (e.g., "Reverie SMP").
2. Go to the **OAuth2** tab.
3. Under **Redirects**, click **Add Redirect** and enter:
   ```
   https://reveriesmp.indevs.in/api/auth/discord/callback
   ```
   *(Or your current domain / `http://localhost:3000/api/auth/discord/callback` for local testing)*
4. Under **Client Information**, copy the **Client ID** and generate a **Client Secret**.
5. Paste them into your `.env` file for `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`.
6. Save the `.env` file (`Ctrl+O` then `Ctrl+X` in nano).

---

## 2. Installation & Build

```bash
# Navigate to the project folder
cd reverie

# Install packages
pnpm install
# (or: npm install)

# Build the production bundle
pnpm build
# (or: npm run build)
```

---

## 3. Running with PM2 (Recommended for 24/7 Uptime)

Run the server with PM2 so it automatically runs in the background and restarts on server reboot:

```bash
# If already running with an older version, delete the old process:
pm2 delete reverie 2>/dev/null || true

# Start Next.js with PM2:
pm2 start "node_modules/next/dist/bin/next" --name reverie -- start

# Save process list so it starts on system boot:
pm2 save
pm2 startup
```

To view live server logs:
```bash
pm2 logs reverie
```

To restart the server after updating `.env`:
```bash
pm2 restart reverie
```

---

## 4. Flat-File Data Storage

All data is stored directly in `./data/*.json` (created automatically on first write):

```
data/
  settings.json        ← site configuration, theme, widgets, socials
  categories.json      ← forum categories (auto-seeded on first run)
  topics.json          ← forum topics
  replies.json         ← forum replies
  tickets.json         ← support tickets with Discord user IDs
  ticket-messages.json ← threaded ticket replies between staff & players
  staff.json           ← staff team members & ranks
  announcements.json   ← server announcements
  admins.json          ← sub-admin accounts
```

> **Backup Tip**: Simply back up the `data/` folder to back up your entire server database. No SQL or external database needed!
