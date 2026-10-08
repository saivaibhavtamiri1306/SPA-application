# Build preflight

Before pushing, make sure the repository root contains `netlify.toml`, `frontend/package.json`, `frontend/angular.json`, and `netlify/functions/api.ts`.

From the repository root:

```powershell
npm run build
```

The final Angular files should be under:

```text
frontend/dist/trustvault-core/browser
```

For deployment, the Netlify build is configured to install dependencies with `npm install` and then build the Angular app. This avoids relying on a missing or stale lockfile.
