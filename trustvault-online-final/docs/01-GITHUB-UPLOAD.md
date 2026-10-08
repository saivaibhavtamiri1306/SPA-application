# GitHub upload — super easy

Imagine GitHub is your online school bag. We are putting the whole project inside it.

## 1. Open the extracted folder

Use the folder that directly contains:

```text
frontend/
netlify/
docs/
README.md
netlify.toml
```

## 2. Open terminal in that folder

```powershell
git init
git branch -M main
git remote add origin https://github.com/saivaibhavtamiri1306/SPA-application.git
```

## 3. Save everything

```powershell
git add .
git commit -m "TrustVault Core online full-stack release"
```

## 4. Send to GitHub

```powershell
git push -u origin main
```

If GitHub asks you to sign in, complete the normal GitHub authentication.

## 5. Check GitHub

You should see:

```text
frontend/
netlify/functions/
docs/
README.md
netlify.toml
```

Do not upload:

```text
node_modules/
.env
```
