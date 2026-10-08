import { Router } from 'express';
import { repository } from '../repositories/trustvault.repository.js';
import { requestedDelay, wait } from '../utils/delay.js';
import { requireAccess, requireAdmin } from '../middleware/auth.js';

export const dataRouter=Router();
dataRouter.use(requireAccess);

dataRouter.get('/records',async(req,res)=>{await wait(requestedDelay(req,1500));const s=await repository.get();const admin=req.auth!.role==='Admin';res.json(s.records.map(r=>admin?{...r,status:r.status==='Encrypted'?'Decrypted':r.status}:r.level==='Confidential'?{...r,title:'██████████████ [ENCRYPTED]',status:'Locked',size:'---'}:{...r}));});
dataRouter.get('/records/:id',async(req,res)=>{await wait(requestedDelay(req,450));const s=await repository.get();const r=s.records.find(x=>x.id===req.params.id);if(!r){res.status(404).json({message:'Record not found'});return;}const admin=req.auth!.role==='Admin';res.json(admin?{...r,status:r.status==='Encrypted'?'Decrypted':r.status}:r.level==='Confidential'?{...r,title:'██████████████ [ENCRYPTED]',status:'Locked',size:'---'}:r);});
dataRouter.get('/candidates',async(req,res)=>{await wait(requestedDelay(req,800));const s=await repository.get();res.json(s.candidates.map(c=>repository.candidateView(c,req.auth!.role==='Admin')));});
dataRouter.get('/candidates/:id',async(req,res)=>{await wait(requestedDelay(req,500));const s=await repository.get();const c=s.candidates.find(x=>x.id===req.params.id);if(!c){res.status(404).json({message:'Candidate not found'});return;}res.json(repository.candidateView(c,req.auth!.role==='Admin'));});
dataRouter.get('/candidates/:id/status',async(req,res)=>{await wait(requestedDelay(req,300));const s=await repository.get();const c=s.candidates.find(x=>x.id===req.params.id);if(!c){res.status(404).json({message:'Candidate not found'});return;}c.polls=Number(c.polls||0)+1;if(c.stage<3&&c.polls%2===0)c.stage++;await repository.save(s);res.json({stage:Number(c.stage),score:Number(c.score)});});
dataRouter.put('/candidates/:id/stage',requireAdmin,async(req,res)=>{await wait(requestedDelay(req,400));const s=await repository.get();const c=s.candidates.find(x=>x.id===req.params.id);const stage=Number(req.body?.stage);if(!c||!Number.isInteger(stage)||stage<0||stage>3){res.status(400).json({message:'Invalid candidate stage'});return;}c.stage=stage;await repository.save(s);res.json({ok:true});});
