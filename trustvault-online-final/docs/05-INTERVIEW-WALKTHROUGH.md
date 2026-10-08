# Interview walkthrough

## Explain the project in 30 seconds

"TrustVault Core is a fictional background-verification workspace. The frontend is built in Angular 18 and the backend is a TypeScript Netlify Function. MongoDB Atlas stores online data. I implemented role-based access, MFA flow, async API delays, PII masking, user management, drag-and-drop verification stages, audit events and Web Worker hashing while keeping the interface focused on a security product experience."

## If they ask why Netlify Functions

"I wanted the API to live online without keeping my personal laptop or VS Code running. Netlify Functions give me server-side endpoints deployed with the site."

## If they ask why MongoDB Atlas

"The assignment allows database-backed storage. Atlas gives me an online MongoDB database that the serverless API can reach."

## If they ask about the 2FA

"The OTP is a fixed demo value because this is an internship coding challenge. The production-safe part I demonstrate is the server-side MFA session token and final JWT issuance."

## If they ask what is simulated

"The biometric scan and verification data are simulated demo experiences. I do not claim that the application is a real biometric or identity-verification service."
