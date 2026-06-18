# Deploying Islandr.io — Vercel (frontend) + Railway (backend)

Topology:

```
                 ┌─────────────────────────┐
  Browser ─────▶ │ Vercel (static client)  │  index.html, JS bundle, assets, /data
                 │  /api/*  ──proxy──▶ Railway API
                 └─────────────────────────┘
        │ wss:// (direct)
        ▼
  ┌──────────────────────┐        ┌──────────────────────────────┐
  │ Railway: GAME server │ ◀─────▶│ Railway: API server + SQLite │ (persistent volume)
  │   server/  (ws)      │  HTTP  │   api -> lib  (express)      │
  └──────────────────────┘        └──────────────────────────────┘
```

Repo: `https://github.com/0xNickdev/islandir` (branch `main`).

---

## 1. Railway — API server (Express + SQLite)

1. **New Project → Deploy from GitHub repo** → pick `0xNickdev/islandir`.
2. This first service = the **API**. Leave **Root Directory** = `/` (it picks up the root `railway.json`).
3. **Variables**:
   - `SERVER_DB_TOKEN` = a long random secret (save it — the game server needs the same value).
   - `DB_PATH` = `/data/players.db`
4. **Add a Volume** (Service → Settings → Volumes): mount path `/data`. This is what keeps accounts/currency across redeploys.
5. **Networking → Generate Domain.** Copy it, e.g. `islandir-api.up.railway.app`. → this is your **API domain**.

## 2. Railway — Game server (WebSocket)

1. In the **same project**: **New → GitHub Repo → same repo** (a second service).
2. **Settings → Root Directory** = `server` (it picks up `server/railway.json`).
3. **Variables**:
   - `API_URL` = `https://islandir-api.up.railway.app`  (the API domain from step 1.5)
   - `SERVER_DB_TOKEN` = the **same** secret as the API service.
4. **Networking → Generate Domain.** Copy it, e.g. `islandir-game.up.railway.app`. → this is your **game domain**.

> Do **not** set `PORT` on either service — Railway injects it and the code reads `process.env.PORT`.

## 3. Vercel — static client

1. **Add New → Project → Import** `0xNickdev/islandir`. Framework preset: **Other** (config comes from `vercel.json`).
2. **Environment Variables** (Production):
   - `GAME_SERVER_URL` = `islandir-game.up.railway.app`  (game domain, **no** `https://`, **no** port)
3. **Edit `vercel.json`** before/while deploying: replace `REPLACE_WITH_RAILWAY_API_DOMAIN` with your **API domain** (e.g. `islandir-api.up.railway.app`). Commit & push.
4. Deploy. Vercel runs `scripts/build-vercel.sh`, builds the client into `dist/`, and proxies `/api/*` to the Railway API.

## 4. Verify

- Open the Vercel URL → the menu loads, the **Server Address** field is pre-filled with the game domain.
- Click **Play** → browser opens `wss://<game-domain>` (auto-`wss` because the page is HTTPS).
- Login/signup → hits `/api/...` → Vercel proxies to the Railway API → SQLite on the volume.

---

## What changed in the code for deployment

| File | Change | Why |
|------|--------|-----|
| `server/src/index.ts` | `ws.Server` port → `process.env.PORT || 8080` | Railway assigns the port |
| `api/index.ts` | SQLite path → `process.env.DB_PATH || "players.db"` | Point DB at the Railway volume |
| `client/src/game.ts` | protocol → `wss` when page is HTTPS | Browsers block `ws://` from an HTTPS page |
| `client/src/utils.ts` | `/api/...` relative paths | Go through the Vercel→Railway proxy (no CORS) |
| `vercel.json` | static build + `/api/*` proxy | Serve client, route API to Railway |
| `scripts/build-vercel.sh` | assemble `dist/`, inject `GAME_SERVER_URL` | Vercel build |
| `railway.json`, `server/railway.json` | build/start commands | Railway services |

## Local development is unchanged

`npm run start` still works: client uses `ws://127.0.0.1:8080` (page is HTTP) and the local
Express server answers `/api/*` directly. SQLite falls back to `./players.db`.

## Notes / gotchas

- **WebSockets are NOT proxied through Vercel** — the client talks to Railway directly over `wss`. That's why `GAME_SERVER_URL` is separate from the API proxy.
- The API domain in `vercel.json` is hardcoded (Vercel can't read env vars inside rewrites). If the Railway API domain changes, update `vercel.json` and redeploy.
- `SERVER_DB_TOKEN` must match on both Railway services or currency/kill syncing returns 403.
- The default region/single instance is fine to start; the game server keeps state in memory, so run a **single** game-server instance (do not scale it horizontally without a shared world).
