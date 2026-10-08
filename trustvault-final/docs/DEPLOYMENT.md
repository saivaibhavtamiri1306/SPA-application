# Deployment Guide

## Frontend

Build:

```bash
cd frontend
npm install
npm run build
```

The static output is under `frontend/dist/trustvault-core/`.

Deploy that folder to a static host such as GitHub Pages, Cloudflare Pages or Netlify.

## Backend

Build:

```bash
cd backend
npm install
npm run build
npm start
```

Set:

```text
PORT=3000
JWT_SECRET=<strong-random-secret>
CORS_ORIGIN=<deployed-frontend-origin>
```

## Data store note

XML is appropriate for the internship demo because the challenge explicitly allows local XML storage.

For production, use a managed database and persistent storage.

## Free hosting reality

Static hosting can remain available without a continuously running application server. Free backend plans may sleep or have quotas, so do not promise guaranteed 24/7 uptime.
