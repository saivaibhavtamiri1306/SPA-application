import { Router } from 'express';
import { repository } from '../repositories/trustvault.repository.js';
import { requireAccess, requireAdmin } from '../middleware/auth.js';
import { requestedDelay, wait } from '../utils/delay.js';
export const auditRouter=Router();auditRouter.use(requireAccess,requireAdmin);
auditRouter.get('/audit/stream',async(req,res)=>{await wait(requestedDelay(req,900));const s=await repository.get();res.json(s.audit);});
