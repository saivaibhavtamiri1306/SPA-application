# 🛡️ TrustVault Core — Online Full-Stack Demo

**TrustVault Core** is a fictional background-verification workspace designed to look like a real security product while demonstrating practical full-stack engineering.

> **Important:** all candidate names, phone numbers, identity values and verification results in this project are fictional demo data. The biometric/security scan is a UI simulation, not a real biometric system.

## 🌟 What you will see

```text
LOGIN
  ↓
2-FACTOR VERIFICATION
  ↓
BIOMETRIC-STYLE SECURITY SCAN
  ↓
COMMAND CENTER
  ↓
DATA VAULT
  ↓
USER MANAGEMENT (ADMIN)
  ↓
VERIFICATION PIPELINE
  ↓
AUDIT LEDGER
```

## 🧠 Technology in very simple words

Think of the project like a restaurant:

- **Angular** = the dining room and menu. It is the part you see.
- **Netlify Functions** = the kitchen. It runs online when a request arrives.
- **MongoDB Atlas** = the secure storage room for users, candidates and records.
- **JWT** = the temporary security pass after login.

Your laptop is **not the production server**. After deployment, Netlify hosts the Angular site and serverless API online. Netlify Functions are designed to run server-side code without you managing a server. urlNetlify Functions docshttps://docs.netlify.com/build/functions/overview/

## 📁 Project map

```text
trustvault-final/
├── frontend/                 # Angular 18.2.14 app
│   ├── src/app/core/         # services, auth guard, interceptor, models
│   ├── src/app/features/     # login + dashboard + records + users + pipeline + audit
│   └── src/app/shared/       # 3D background + reusable UI helpers
│
├── netlify/functions/        # online TypeScript API
│   └── api.ts
│
├── docs/                     # easy guides
├── netlify.toml              # Netlify build + API routing
├── .gitignore
└── README.md
```

## ✅ Challenge requirements covered

| Requirement | Implementation |
|---|---|
| Angular 12+ | Angular **18.2.14** |
| TypeScript | Frontend + Netlify API |
| Login | Reactive Form + REST API |
| Roles | Admin / General User |
| Dummy API | Netlify Function |
| Database | MongoDB Atlas |
| User service | Angular `UserService` equivalent is provided through `ApiService` + Users feature |
| Admin management | Create / Edit / Suspend / Restore / Delete |
| API delay | `?delay=...` query parameter |
| Async loading | Angular RxJS + loading states |
| Data masking | Admin vs General User response filtering |
| Pipeline | Drag and drop + persisted stage update |
| Audit | 10,000 deterministic events |
| Web Worker | SHA-256 chain verification |
| CSV/PDF | Browser exports |
| Offline demo | Cached GET responses |
| Responsive UI | Desktop + mobile layout |
| 3D visuals | Three.js animated background |

## 💻 Easiest local preview

You only need one development command from the project root:

```powershell
npm install
npm run dev
```

Netlify Dev starts a local simulation of the Netlify environment. The final production site does **not** depend on your laptop.

Open the local address printed by Netlify, usually:

```text
http://localhost:8888
```

## 🔐 Demo accounts

### Admin

```text
User ID:  admin
Password: admin
Role:     Admin
OTP:      123456
```

### General User

```text
User ID:  priya
Password: priya
Role:     General User
OTP:      123456
```

## ☁️ Online database setup

MongoDB Atlas provides Free Clusters for learning/prototyping use cases. urlMongoDB Atlas cluster docshttps://www.mongodb.com/docs/atlas/manage-clusters/

Create a MongoDB Atlas Free Cluster, create a database user, allow the Netlify connection, and copy the connection string. Put these values in **Netlify Environment Variables**:

```text
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority
MONGODB_DB=trustvault
JWT_SECRET=<long-random-secret>
```

Never commit these secrets to GitHub.

## 🚀 Netlify deployment in 10-year-old language

### Step 1 — Put the project on GitHub

Upload the contents of `trustvault-final` to your `SPA-application` repository.

### Step 2 — Connect GitHub to Netlify

In Netlify:

```text
Add new project
→ Import an existing project
→ GitHub
→ SPA-application
```

### Step 3 — Build settings

The repository already contains `netlify.toml`, so Netlify can use the configured build and function settings.

The important values are:

```text
Build command:
npm install --no-audit --no-fund && cd frontend && npm install --no-audit --no-fund && npm run build

Publish directory:
frontend/dist/trustvault-core/browser

Functions directory:
netlify/functions
```

Netlify documents build commands and publish directories as the two main pieces used to prepare and publish a site. urlNetlify build docshttps://docs.netlify.com/build/frameworks/overview/

### Step 4 — Add the three environment variables

In Netlify:

```text
Project configuration
→ Environment variables
→ Add a variable
```

Add:

```text
MONGODB_URI
MONGODB_DB
JWT_SECRET
```

### Step 5 — Deploy

Click **Deploy site** / **Redeploy**.

Netlify then does this:

```text
GitHub
  ↓
Install packages
  ↓
Build Angular
  ↓
Publish Angular files
  ↓
Deploy TypeScript Function
  ↓
LIVE SITE ✅
```

### Step 6 — Test the live site

Do not test with `localhost`.

Open the Netlify URL and test:

```text
Admin login
→ OTP
→ Dashboard
→ Records
→ Users
→ Pipeline
→ Audit
```

## 🧪 API delay demo

The API accepts a delay parameter so the loading UI is easy to demonstrate:

```text
/api/records?delay=3000
/api/candidates?delay=2000
/api/audit?count=10000&delay=1500
```

The server caps the artificial delay at 10 seconds for safety.

## 🧩 Production architecture

```text
                    INTERNET
                       │
                       ▼
              ┌─────────────────┐
              │     Netlify     │
              │ Angular Website │
              └────────┬────────┘
                       │ /api/*
                       ▼
              ┌─────────────────┐
              │ Netlify Function│
              │ TypeScript API  │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ MongoDB Atlas   │
              │ Online Database │
              └─────────────────┘
```

## ⭐ Why this architecture is better for the internship

- The browser is no longer the database.
- The API is not running on your laptop in production.
- The frontend is a real Angular application.
- The API is written in TypeScript and deployed with the site.
- MongoDB Atlas stores data online.
- Authentication and role checks happen on the server.
- Async delay is an actual API feature, not only a fake browser timer.

## ⚠️ Security note

This is an **internship demo**, not a production identity-verification system. OTP `123456`, sample records, simulated biometric scan and fallback demo storage are intentionally simple. For a real product, use a real MFA provider, secure secret management, stronger auditing, encryption/key management, validation, rate limiting and production observability.

## 📚 Guides

- `docs/01-GITHUB-UPLOAD.md`
- `docs/02-MONGODB-ATLAS.md`
- `docs/03-NETLIFY-DEPLOY.md`
- `docs/04-VS-CODE.md`
- `docs/05-INTERVIEW-WALKTHROUGH.md`

## 🏁 Final test checklist

```text
[ ] npm install works
[ ] npm run dev opens local TrustVault
[ ] Admin login works
[ ] General User login works
[ ] Wrong password is rejected
[ ] Wrong OTP is rejected
[ ] Admin sees Users / Pipeline / Audit
[ ] General User cannot open admin routes
[ ] Records load with delay
[ ] Admin sees full records
[ ] General User sees masked confidential records
[ ] User can be created
[ ] User can be suspended/restored
[ ] Pipeline drag-and-drop saves
[ ] Audit loads 10,000 events
[ ] Web Worker hashing completes
[ ] CSV works
[ ] PDF works
[ ] Netlify build succeeds
[ ] Live API works without your laptop
```
