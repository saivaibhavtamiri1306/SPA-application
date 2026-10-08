# VS Code Run Guide

## Requirements

Use a recent Node.js LTS release compatible with Angular 18.

## Backend

```bash
cd backend
npm install
npm run dev
```

Open a second terminal.

## Frontend

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200`.

## Demo credentials

Admin:
- id: admin
- password: admin
- role: Admin
- OTP: 123456

General user:
- id: priya
- password: priya
- role: General User
- OTP: 123456

## Backend health check

`http://localhost:3000/api/health`

## API delay examples

```text
http://localhost:3000/api/records?delay=3000
http://localhost:3000/api/candidates?delay=5000
```
