# 🛡️ TRUSTVAULT CORE
### **Build Trust • Verify Faster • Secure Better**

TrustVault Core is a futuristic **background-verification operations console** built for an internship-style full-stack engineering challenge.

> **Think of it like a secure control room.**
> You sign in → prove who you are → the system checks your access → records are loaded through an API → Admins can manage users → candidates move through verification stages → every action can be inspected in the audit ledger.

---

## ✨ What you can do

| Feature | What it means in simple words |
|---|---|
| 🔐 Login | Enter User ID, Password and Role |
| 🔢 Two-Factor Verification | Enter a 6-digit demo code before access is granted |
| 🧬 Biometric Scan | A visual security simulation before the dashboard opens |
| 🎛️ Command Center | See verification health, live activity and widgets |
| 🗄️ Data Vault | Search records, filter them and enforce role-aware masking |
| 👤 User Management | Admin can create, edit, suspend, restore and delete users |
| 🔄 Verification Pipeline | Drag candidates from Initiated → Queried → Verified → Cleared |
| 📜 Audit Ledger | View 10,000 events with virtual rendering |
| ⚙️ Async API Delay | Try `?delay=3000` to make API calls intentionally slow |
| 🧵 Web Worker | Hash the audit chain without freezing the main UI |
| 📦 CSV/PDF Export | Export records and verification reports |
| 🌐 Languages | English, Telugu and Hindi |
| 📴 Offline Cache | Simulate a server outage and continue using cached GET data |
| 🌌 Three.js | Animated 3D security background + verification visual |
| 📱 Responsive UI | Desktop, tablet and mobile layouts |

---

## 🧩 Technology Stack

### Frontend
- **Angular 18.2.x** — satisfies the challenge requirement of **Angular 12+**
- TypeScript
- Angular Router + lazy-loaded feature routes
- Reactive Forms
- HTTP Interceptor + Guards
- RxJS
- Three.js
- jsPDF
- HTML/CSS/Sass

### Backend
- Node.js
- Express
- TypeScript
- JWT authentication
- `crypto.scryptSync` password hashing
- CORS + Morgan
- XML persistent data store
- Configurable API delay

### Architecture

```text
                     ┌──────────────────────────────┐
                     │       ANGULAR FRONTEND       │
                     │                              │
                     │  Auth • Dashboard • Vault   │
                     │  Users • Pipeline • Audit   │
                     └──────────────┬───────────────┘
                                    │ HTTPS/HTTP REST
                                    ▼
                     ┌──────────────────────────────┐
                     │       NODE + EXPRESS API      │
                     │                              │
                     │ JWT • Role Guard • Routes   │
                     │ Delay • Validation • CORS    │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │        XML DATA STORE         │
                     │ users • candidates • records│
                     │ audit events                 │
                     └──────────────────────────────┘
```

---

## 🧠 How the application works

```text
1. Open the login page
        ↓
2. Choose Admin or General User
        ↓
3. Angular calls POST /api/auth/login
        ↓
4. API returns a short-lived MFA token
        ↓
5. Enter OTP 123456
        ↓
6. API returns a JWT access token
        ↓
7. Animated verification scan
        ↓
8. Protected Angular workspace opens
        ↓
9. API calls load records/candidates
        ↓
10. Admin-only pages are protected by Angular + API authorization
```

---

## 🔑 Demo accounts

### Admin

```text
User ID  : admin
Password : admin
Role     : Admin
OTP      : 123456
```

### General User

```text
User ID  : priya
Password : priya
Role     : General User
OTP      : 123456
```

New users created by Admin use their **User ID as the initial demo password**. Change this strategy for a production authentication system.

---

## 🚀 Run in VS Code

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

API:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/api/health
```

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

Frontend:

```text
http://localhost:4200
```

---

## 🧪 Test the async delay requirement

The challenge asks for a mechanism to demonstrate API delay.

TrustVault supports it directly:

```text
GET /api/records?delay=3000
GET /api/candidates?delay=5000
GET /api/audit/stream?delay=2500
```

The Angular UI shows loading states while the API is intentionally delayed.

---

## 🛡️ Role behaviour

### General User

Can access:

- Command Center
- Data Vault

Confidential records are masked/locked.

### Admin

Can access:

- Command Center
- Data Vault
- Manage Users
- Verification Pipeline
- Audit Ledger

Admin-only mutation endpoints are protected on the API, not just hidden in the UI.

---

## 🧵 Why the Audit Ledger is interesting

The Audit page loads **10,000 events**.

Instead of trying to place every row into the DOM at the same time, the UI renders only the visible window.

Then you can press:

```text
VERIFY CHAIN IN WEB WORKER
```

The browser creates a SHA-256 chain inside a Worker so heavy hashing does not block the main interface.

---

## 🌌 Why the UI looks different

TrustVault deliberately uses a security-console visual language:

- glassmorphism
- neon cyan/purple accents
- cyber terminal typography
- scanline/glitch effects
- animated loaders
- 3D verification visuals
- animated progress states
- responsive sidebar
- tactile hover states
- 3D-style report modals

The original prototype is also preserved as a visual reference in:

```text
frontend/src/assets/original-prototype.html
```

This file is kept as the visual reference for the final Angular rebuild; the production path uses native Angular components rather than executing that HTML file.

---

## 📁 Project structure

```text
trustvault-final/
│
├── frontend/
│   ├── src/app/core/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── models/
│   │   └── services/
│   │
│   ├── src/app/features/
│   │   ├── auth/
│   │   └── workspace/
│   │       ├── dashboard/
│   │       ├── records/
│   │       ├── users/
│   │       ├── pipeline/
│   │       └── audit/
│   │
│   ├── src/app/shared/
│   └── src/styles.scss
│
├── backend/
│   ├── src/middleware/
│   ├── src/repositories/
│   ├── src/routes/
│   ├── src/utils/
│   └── data/store.xml
│
├── docs/
├── README.md
└── .gitignore
```

---

## 🎯 Internship challenge mapping

| Challenge requirement | TrustVault implementation |
|---|---|
| Angular 12+ | Angular 18.2.x |
| Login page | Angular Reactive Forms |
| User ID + Password + Role | ✅ |
| Dummy API | Real demo REST API with fictional data |
| XML/MongoDB/DynamoDB storage | XML persistent store ✅ |
| General User + Admin | ✅ |
| User records table | Data Vault |
| Role-based access | Angular guards + API authorization |
| Admin user management | Create/Edit/Suspend/Restore/Delete |
| API delay parameter | `?delay=...` |
| Async processing | RxJS + concurrent dashboard requests |
| User Service | `core/services/user.service.ts` |
| Modular architecture | Core + Shared + Feature modules/routes |
| UI/UX | Custom cyber-security console |
| Clean architecture | Frontend services + Backend routes/repository/store |

---

## 📤 GitHub upload

```bash
git init
git add .
git commit -m "Build TrustVault Core Angular full-stack platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/trustvault-angular.git
git push -u origin main
```

Do **not** commit:

```text
node_modules/
.env
```

Use `.env.example` as the safe template for environment variables.

---

## 🌍 Free deployment plan

### Frontend
Good static-hosting choices:

- GitHub Pages
- Cloudflare Pages
- Netlify

### Backend
Deploy the Node API separately on a service that supports Node/Express.

> Free backend tiers can sleep, have request/storage limits, or change their plans. Do not describe a free tier as a guaranteed 24/7 uptime service.

For a serious production deployment, move the XML store to a managed database such as MongoDB Atlas or DynamoDB and use HTTPS with a production secret.

---

## ✅ Submission checklist

Before submitting:

- [ ] `npm install` works in `frontend`
- [ ] `npm install` works in `backend`
- [ ] Angular starts on port 4200
- [ ] Node API starts on port 3000
- [ ] Admin login works
- [ ] General User login works
- [ ] OTP `123456` works
- [ ] General User cannot open Admin routes
- [ ] Admin can add a user
- [ ] Admin can edit a user
- [ ] Admin can suspend/restore a user
- [ ] Admin can delete a non-primary user
- [ ] Candidate drag-and-drop saves to API
- [ ] Data Vault masking works
- [ ] API delay is visible
- [ ] Audit Worker hashing works
- [ ] CSV/PDF export works
- [ ] Mobile layout looks good
- [ ] No `.env` is committed

---

## ⭐ Portfolio description

**TrustVault Core — Full-Stack Background Verification Platform**

A futuristic Angular + Node.js verification console featuring JWT + MFA authentication, role-based authorization, persistent XML storage, asynchronous API delays, candidate workflow orchestration, privacy-aware masking, 10,000-event audit visualization, Web Worker hashing, CSV/PDF exports, multilingual support, offline caching and Three.js security visuals.

---

## ⚠️ Important demo disclaimer

This application is an **educational/internship demonstration**.
All identities, phone numbers, IDs, scores and audit events are fictional.
The biometric, encryption and verification language is visual/demo behaviour unless backed by a real production service.

---

## 👨‍💻 Built for learning

The project is designed to make it easy for a reviewer to answer three questions immediately:

> **What is it?**
> A background-verification control room.

> **How does it work?**
> Angular frontend → Node API → persistent XML data.

> **Why is it interesting?**
> It combines real full-stack architecture with a highly interactive security-focused UI.
