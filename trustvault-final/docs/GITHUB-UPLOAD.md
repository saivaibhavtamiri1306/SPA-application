# GitHub Upload — TrustVault Core

## Easiest route

### Step 1
Create a new GitHub repository:

`trustvault-angular`

### Step 2
Open the extracted project in VS Code.

### Step 3
Open the terminal at the project root:

```bash
git init
git add .
git commit -m "Build TrustVault Core Angular full-stack platform"
git branch -M main
```

### Step 4
Connect GitHub:

```bash
git remote add origin https://github.com/YOUR_USERNAME/trustvault-angular.git
git push -u origin main
```

### Step 5
Refresh GitHub. You should see:

- frontend/
- backend/
- docs/
- README.md
- .gitignore

### Never push

- `.env`
- real credentials
- API keys
- `node_modules/`

## GitHub web upload alternative

1. Create the repository.
2. Click **Add file → Upload files**.
3. Upload the project contents.
4. Commit the changes.

For this full-stack project, Git is strongly recommended because it preserves the folder structure and future commits cleanly.
