# GitHub + Free Hosting Guide

## 1. Push source code

From the repository root:

```bash
git init
git add .
git commit -m "Build TrustVault Core Angular full-stack platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/trustvault-angular.git
git push -u origin main
```

## 2. Frontend deployment

### Option A — GitHub Pages

Build the Angular app:

```bash
cd frontend
npm install
npm run build
```

Deploy the generated static folder with GitHub Pages using your preferred Pages workflow/action. The Angular project already contains `<base href="/">` so routing starts from the site root. For a repository sub-path, set the base href to that repository path during the production build.

### Option B — Cloudflare Pages

Connect the GitHub repository. Set the project root to `frontend`.

Typical build command:

```text
npm install && npm run build
```

Publish directory:

```text
frontend/dist/trustvault-core
```

### Option C — Netlify

Connect the repository, set the base directory to `frontend`, build with `npm run build`, and publish `frontend/dist/trustvault-core`.

## 3. Backend deployment

Deploy `backend/` as a Node.js service. Set:

```text
PORT=3000
JWT_SECRET=<strong-random-secret>
CORS_ORIGIN=<your-frontend-origin>
```

Build command:

```text
npm install && npm run build
```

Start command:

```text
npm start
```

## Important

Free backend hosting can sleep, have quotas, and have ephemeral filesystems. The XML store is challenge-approved for the demo, but for production move the data layer to a managed database with persistent storage.
