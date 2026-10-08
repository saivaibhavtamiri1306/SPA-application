import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { repository } from '../repositories/trustvault.repository.js';
import { verifyPassword } from '../utils/security.js';
import { requestedDelay, wait } from '../utils/delay.js';
import { requireAccess } from '../middleware/auth.js';

export const authRouter=Router();
const DEMO_OTP='123456';

authRouter.post('/login',async(req,res)=>{await wait(requestedDelay(req,1200));const {userId,password,role}=req.body||{};const u=await repository.findUser(String(userId||''));if(!u||!verifyPassword(String(password||''),String(u.passwordHash||''))){res.status(401).json({message:'AUTH_FAIL: Invalid operator credentials.'});return;}if(u.role!==role){res.status(401).json({message:`AUTH_FAIL: Access Denied. User is not ${role}.`});return;}if(u.status!=='Active'){res.status(401).json({message:'AUTH_FAIL: Account suspended.'});return;}const preAuthToken=jwt.sign({id:u.id,role:u.role,kind:'mfa'},config.jwtSecret,{expiresIn:'5m'});res.json({preAuthToken,user:repository.userView(u)});});

authRouter.post('/mfa',async(req,res)=>{await wait(requestedDelay(req,600));try{const p=jwt.verify(String(req.body?.preAuthToken||''),config.jwtSecret) as {id:string;role:'Admin'|'General User';kind:string};if(p.kind!=='mfa')throw new Error('invalid');if(String(req.body?.otp||'')!==DEMO_OTP){res.status(401).json({message:'AUTH_FAIL: Invalid verification code.'});return;}const accessToken=jwt.sign({id:p.id,role:p.role,kind:'access'},config.jwtSecret,{expiresIn:'4h'});const u=await repository.findUser(p.id);res.json({token:accessToken,user:repository.userView(u)});}catch{res.status(401).json({message:'AUTH_FAIL: MFA session expired. Please sign in again.'});}});

authRouter.get('/me',requireAccess,async(req,res)=>{const u=await repository.findUser(req.auth!.id);if(!u){res.status(404).json({message:'User not found'});return;}res.json(repository.userView(u));});
