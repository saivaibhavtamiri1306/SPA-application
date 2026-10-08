import type { Request } from 'express';
export function requestedDelay(req:Request, fallback=0):number { const raw=Number(req.query['delay'] ?? fallback); return Number.isFinite(raw) ? Math.min(Math.max(Math.round(raw),0),10000) : fallback; }
export function wait(ms:number):Promise<void>{return new Promise(resolve=>setTimeout(resolve,ms));}
