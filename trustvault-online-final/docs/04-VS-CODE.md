# VS Code — simple explanation

## Quick local preview

From the project root:

```powershell
npm install
npm run dev
```

Netlify Dev can run the website and emulate Netlify Functions locally. The default Functions development command is documented by Netlify. urlNetlify Functions local developmenthttps://docs.netlify.com/api-and-cli-guides/cli-guides/manage-functions/

Open the local URL printed in the terminal, commonly:

```text
http://localhost:8888
```

## Why this is different from production

Local:

```text
VS Code → Netlify Dev → local simulation
```

Production:

```text
GitHub → Netlify → online website + online Function
```

You do **not** have to leave VS Code open for the production website.
