import 'dotenv/config';
export const config = {
  port: Number(process.env['PORT'] || 3000),
  jwtSecret: process.env['JWT_SECRET'] || 'trustvault-development-secret-change-me',
  corsOrigin: process.env['CORS_ORIGIN'] || 'http://localhost:4200'
};
