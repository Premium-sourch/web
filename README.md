# Lamix SMS — Production Deployment Guide (Hostinger Node.js)

## Requirements

- Node.js **v20 or higher**
- A Hostinger Node.js hosting plan

---

## Step 1 — Upload Files

Upload the entire contents of this folder to your Hostinger Node.js server's root directory (usually `public_html` or the directory shown in your hosting panel).

Your server should look like this after upload:
```
dist/
  index.mjs
  pino-worker.mjs
  pino-file.mjs
  pino-pretty.mjs
  thread-stream-worker.mjs
  public/
    index.html
    sw.js
    favicon.svg
    assets/
package.json
.env
README.md
```

---

## Step 2 — Install Dependencies

In your Hostinger SSH terminal, run:

```bash
npm install --omit=dev
```

---

## Step 3 — Create the `.env` File

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env` and fill in your values:

### SESSION_SECRET

Generate a secure random secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as the value for `SESSION_SECRET`.

### VAPID Keys (Push Notifications)

Generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

Copy the **Public Key** and **Private Key** into `.env`.

Set `VAPID_EMAIL` to any email address (e.g. `mailto:admin@yourdomain.com`).

### PORT

Hostinger usually sets `PORT` automatically as an environment variable. Leave it as `3000` in `.env` as a fallback, but Hostinger may override it.

---

## Step 4 — Configure the Startup Command

In your Hostinger Node.js hosting panel, set the **startup command** to:

```
npm start
```

Or directly:

```
node --enable-source-maps ./dist/index.mjs
```

Make sure `NODE_ENV` is set to `production` either in your `.env` or in the Hostinger environment variables panel.

---

## Step 5 — Domain Setup

Point your domain to your Hostinger Node.js server as instructed in the Hostinger panel. The app will serve the frontend and API from the same server — no separate frontend hosting needed.

---

## How it works

- **Frontend** is served as static files from `dist/public/`
- **API** is available at `/api/...`
- All other routes fall back to `index.html` (React SPA routing)

---

## Troubleshooting

| Problem | Fix |
|---|---|
| White screen / blank page | Check `NODE_ENV=production` is set |
| "Server misconfigured" error on login | `SESSION_SECRET` is missing or empty |
| Push notifications not working | Check `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` are set correctly |
| Port already in use | Change `PORT` in `.env` or let Hostinger set it automatically |
