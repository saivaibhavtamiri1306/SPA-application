import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

declare global { namespace Express { interface Request { auth?: {id:string;role:'Admin'|'General User';kind:'access'|'mfa'} } } }
export function requireAccess(req:Request,res:Response,next:NextFunction):void { const h=req.headers.authorization; if(!h?.startsWith('Bearer ')){res.status(401).json({message:'Unauthorized'});return;}try{const p=jwt.verify(h.slice(7),config.jwtSecret) as Express.Request['auth'];if(p?.kind!=='access'){res.status(401).json({message:'Access token required'});return;}req.auth=p;next();}catch{res.status(401).json({message:'Invalid or expired session'});}}
export function requireAdmin(req:Request,res:Response,next:NextFunction):void { if(req.auth?.role!=='Admin'){res.status(403).json({message:'Admin access required'});return;}next(); }
