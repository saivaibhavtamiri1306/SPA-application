import crypto from 'node:crypto';
export function hashPassword(password:string):string { const salt=crypto.randomBytes(16).toString('hex'); const hash=crypto.scryptSync(password,salt,64).toString('hex'); return `scrypt$${salt}$${hash}`; }
export function verifyPassword(password:string,stored:string):boolean { const [,salt,hex]=stored.split('$'); if(!salt||!hex)return false; const actual=crypto.scryptSync(password,salt,64); const expected=Buffer.from(hex,'hex'); return actual.length===expected.length && crypto.timingSafeEqual(actual,expected); }
export function sha256(value:string):string{return crypto.createHash('sha256').update(value).digest('hex');}
