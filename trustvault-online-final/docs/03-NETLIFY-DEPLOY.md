# Netlify deployment — no laptop backend

## The big idea

Your laptop is only used to upload code and test it.

After deployment:

```text
Your laptop OFF ❌
       ↓
Netlify + MongoDB Atlas ✅
       ↓
Website still online
```

Netlify Functions run server-side code without you managing a traditional server. urlNetlify Functions docshttps://docs.netlify.com/build/functions/overview/

## 1. Push GitHub first

Follow `01-GITHUB-UPLOAD.md`.

## 2. In Netlify

```text
Add new project
→ Import an existing project
→ GitHub
→ SPA-application
```

## 3. Build settings

The included `netlify.toml` already contains the intended settings.

Use:

```text
Build command:
npm install --no-audit --no-fund && cd frontend && npm install --no-audit --no-fund && npm run build

Publish directory:
frontend/dist/trustvault-core/browser

Functions:
netlify/functions
```

Netlify says the publish directory contains the finished deploy-ready files and is relative to the base directory/root. urlNetlify build overviewhttps://docs.netlify.com/build/frameworks/overview/

## 4. Add environment variables

```text
MONGODB_URI
MONGODB_DB
JWT_SECRET
```

## 5. Deploy

Click deploy/redeploy.

## 6. Read the deploy log

A good build ends without Angular compiler errors and shows that the publish directory was found.

## 7. Test the live URL

Do not use:

```text
localhost:4200
localhost:3000
```

Use the public Netlify URL.
