import { MongoClient, Db } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

type Role = 'Admin'|'General User';
type Level = 'Alpha (Public)'|'Beta (Internal)'|'Omega (Full)';
interface UserDoc { id:string; name:string; role:Role; accessLevel:Level; status:'Active'|'Suspended'; passwordHash:string; createdAt:string; }
interface Candidate {id:string;name:string;role:string;aadhaar:string;phone:string;score:number;stage:number;}
interface RecordDoc {id:string;title:string;level:'Public'|'Internal'|'Confidential';status:'Decrypted'|'Encrypted';size:string;candidateId:string;}

const mem={
 users:new Map<string,UserDoc>(),
 candidates:new Map<string,Candidate>(),
 records:new Map<string,RecordDoc>()
};
let seeded=false;
let dbPromise:Promise<Db>|null=null;

const seedData=async()=>{
 if(seeded)return;
 const users:[string,string,Role,Level][]=[['admin','Alex Admin','Admin','Omega (Full)'],['priya','Priya Sharma','General User','Beta (Internal)']];
 for(const [id,name,role,accessLevel] of users){mem.users.set(id,{id,name,role,accessLevel,status:'Active',passwordHash:await bcrypt.hash(id,10),createdAt:new Date().toISOString()});}
 const cand:[string,string,string,string,string,number,number][]=[['C-101','Ananya Rao','Backend Engineer','4821 7733 9051','+91 98765 43210',96,3],['C-102','Rohit Verma','DevOps Engineer','3012 5588 1146','+91 91234 56780',88,2],['C-103','Sneha Kulkarni','QA Analyst','7745 2210 6683','+91 99887 76655',79,1],['C-104','Arjun Mehta','Security Analyst','5509 1274 3320','+91 90000 11122',91,0],['C-105','Divya Nair','Data Scientist','2288 9041 7765','+91 98450 22110',84,1],['C-106','Karthik Reddy','Frontend Engineer','6630 4417 8802','+91 97000 33445',72,0],['C-107','Meera Iyer','Product Designer','1194 6650 2237','+91 96000 77889',93,2],['C-108','Vikram Singh','Cloud Architect','8841 3029 5571','+91 95000 99001',67,0]];
 for(const [id,name,role,aadhaar,phone,score,stage] of cand)mem.candidates.set(id,{id,name,role,aadhaar,phone,score,stage});
 const rec:[string,string,'Public'|'Internal'|'Confidential',string,string,string][]=[['REC-77A1','Public Protocol Guidelines','Public','Decrypted','1.2 MB','C-101'],['REC-77B2','System Architecture Map','Internal','Decrypted','14.5 MB','C-102'],['REC-77C3','Employee Network Logs','Internal','Decrypted','256 MB','C-103'],['REC-88D4','Quantum Encryption Keys [Q3]','Confidential','Encrypted','0.5 KB','C-104'],['REC-88E5','Zero-Day Vulnerability Report','Confidential','Encrypted','4.1 MB','C-105'],['REC-99F6','Project Oversight Source','Confidential','Encrypted','2.4 GB','C-106']];
 for(const [id,title,level,status,size,candidateId] of rec)mem.records.set(id,{id,title,level,status,size,candidateId});
 seeded=true;
};

async function getDb():Promise<Db|null>{
 const uri=process.env.MONGODB_URI;
 if(!uri)return null;
 if(!dbPromise){const client=new MongoClient(uri,{serverSelectionTimeoutMS:5000});dbPromise=client.connect().then(c=>c.db(process.env.MONGODB_DB||'trustvault'));}
 return dbPromise;
}
async function ensureSeed(db:Db|null):Promise<void>{
 if(!db){await seedData();return;}
 const users=db.collection<UserDoc>('users');
 if(await users.countDocuments()===0){await seedData();await users.insertMany([...mem.users.values()]);}
 const cs=db.collection<Candidate>('candidates'); if(await cs.countDocuments()===0)await cs.insertMany([...mem.candidates.values()]);
 const rs=db.collection<RecordDoc>('records'); if(await rs.countDocuments()===0)await rs.insertMany([...mem.records.values()]);
}
const response=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
const wait=(ms:number)=>new Promise(r=>setTimeout(r,Math.max(0,Math.min(ms,10_000))));
const parsePath=(req:Request)=>new URL(req.url).pathname.replace(/^\/api/,'').replace(/\/$/,'')||'/';
function secret(){return process.env.JWT_SECRET||'trustvault-demo-change-me';}
function authToken(req:Request):{id:string;role:Role}|null{const h=req.headers.get('authorization')||'';if(!h.startsWith('Bearer '))return null;try{return jwt.verify(h.slice(7),secret()) as {id:string;role:Role};}catch{return null;}}
function mask(v:string):string{return v.replace(/\d(?=(?:\D*\d){4})/g,'•');}
function projectUser(u:UserDoc){const {passwordHash,...safe}=u;return safe;}
async function getUser(id:string):Promise<UserDoc|null>{const db=await getDb();if(!db)return mem.users.get(id)||null;return (await db.collection<UserDoc>('users').findOne({id}))||null;}
async function listUsers():Promise<UserDoc[]>{const db=await getDb();if(!db)return [...mem.users.values()];return db.collection<UserDoc>('users').find({}, {projection:{passwordHash:0}}).sort({id:1}).toArray() as unknown as UserDoc[];}
async function saveUser(u:UserDoc):Promise<void>{const db=await getDb();if(!db){mem.users.set(u.id,u);return;}await db.collection<UserDoc>('users').updateOne({id:u.id},{$set:u},{upsert:true});}
async function updateCandidatesDb(id:string,set:Partial<Candidate>){const db=await getDb();if(!db){const c=mem.candidates.get(id);if(c)Object.assign(c,set);return;}await db.collection<Candidate>('candidates').updateOne({id},{$set:set});}
async function candidateList(role:Role):Promise<unknown[]>{const db=await getDb();const all=db?await db.collection<Candidate>('candidates').find().sort({id:1}).toArray():[...mem.candidates.values()];return all.map(c=>({id:c.id,name:c.name,role:c.role,score:c.score,stage:c.stage,aadhaar:role==='Admin'?c.aadhaar:mask(c.aadhaar),phone:role==='Admin'?c.phone:mask(c.phone),canReveal:role==='Admin'}));}
async function recordsList(role:Role):Promise<unknown[]>{const db=await getDb();const all=db?await db.collection<RecordDoc>('records').find().sort({id:1}).toArray():[...mem.records.values()];return all.map(r=>role==='Admin'?{...r,status:'Decrypted'}:r.level==='Confidential'?{...r,title:'███████████████ [ENCRYPTED]',status:'Locked',size:'---'}:r);}
function audit(count:number){const events:string[]=['AUTH_SUCCESS','DATA_READ','AUTH_FAIL','FIREWALL_BLOCK','POLICY_UPDATE','KEY_ROTATE','EXPORT_CSV','SESSION_END'];const users=['admin','priya','SYSTEM','UNKNOWN','ananya','rohit'];const out=[];let seed=42;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};const base=Date.UTC(2026,9,1);for(let i=0;i<count;i++){const time=new Date(base+i*37_000).toISOString().replace('T',' ').slice(0,19);const evt=events[Math.floor(rnd()*events.length)];const user=users[Math.floor(rnd()*users.length)];const ip=`${10+Math.floor(rnd()*200)}.${Math.floor(rnd()*255)}.${Math.floor(rnd()*255)}.${1+Math.floor(rnd()*254)}`;out.push({i,time,evt,user,ip});}return out;}

export default async (req:Request)=>{
 try{
  const url=new URL(req.url); const path=parsePath(req); const q=Number(url.searchParams.get('delay')||'0'); if(q)await wait(q);
  const publicPaths=path==='/auth/login'||path==='/auth/mfa'||path==='/health';
  if(path==='/health')return response({ok:true,online:true,timestamp:new Date().toISOString()});
  await ensureSeed(await getDb());
  if(path==='/auth/login'&&req.method==='POST'){const b=await req.json();const u=await getUser(String(b.userId||'').toLowerCase());if(!u||u.status!=='Active'||u.role!==b.role||!(await bcrypt.compare(String(b.password||''),u.passwordHash)))return response({message:'Invalid User ID, Password, Role or suspended account.'},401);const mfaToken=jwt.sign({type:'mfa',id:u.id,role:u.role},secret(),{expiresIn:'5m'});return response({mfaToken,user:projectUser(u),otpDemo:'123456',expiresInSeconds:300});}
  if(path==='/auth/mfa'&&req.method==='POST'){const b=await req.json();if(String(b.otp)!=='123456')return response({message:'Invalid demo OTP.'},401);try{const p=jwt.verify(String(b.mfaToken),secret()) as {type:string;id:string;role:Role};if(p.type!=='mfa')throw new Error('bad');const u=await getUser(p.id);if(!u||u.status!=='Active')return response({message:'Account unavailable.'},401);const token=jwt.sign({id:u.id,role:u.role},secret(),{expiresIn:'2h'});return response({token,user:projectUser(u)});}catch{return response({message:'MFA session expired.'},401);}}
  const auth=authToken(req); if(!auth&&!publicPaths)return response({message:'Unauthorized'},401);
  if(path==='/users'&&req.method==='GET'){if(auth!.role!=='Admin')return response({message:'Admin access required.'},403);return response((await listUsers()).map(projectUser));}
  if(path==='/users'&&req.method==='POST'){if(auth!.role!=='Admin')return response({message:'Admin access required.'},403);const b=await req.json();const id=String(b.id||'').toLowerCase();if(!/^[a-z0-9_]{3,20}$/.test(id))return response({message:'User ID must be 3-20 letters, numbers or underscore.'},400);if(await getUser(id))return response({message:'User ID already exists.'},409);const u:UserDoc={id,name:String(b.name||id),role:b.role,accessLevel:b.accessLevel,status:'Active',passwordHash:await bcrypt.hash(id,10),createdAt:new Date().toISOString()};await saveUser(u);return response(projectUser(u),201);}
  const um=path.match(/^\/users\/([^/]+)$/);if(um&&req.method==='PUT'){if(auth!.role!=='Admin')return response({message:'Admin access required.'},403);const u=await getUser(um[1]);if(!u)return response({message:'User not found.'},404);const b=await req.json();u.name=String(b.name??u.name);u.role=b.role??u.role;u.accessLevel=b.accessLevel??u.accessLevel;await saveUser(u);return response(projectUser(u));}
  if(um&&req.method==='DELETE'){if(auth!.role!=='Admin')return response({message:'Admin access required.'},403);if(um[1]==='admin')return response({message:'Primary admin cannot be deleted.'},400);const db=await getDb();if(db)await db.collection<UserDoc>('users').deleteOne({id:um[1]});else mem.users.delete(um[1]);return response({ok:true});}
  const us=path.match(/^\/users\/([^/]+)\/status$/);if(us&&req.method==='PUT'){if(auth!.role!=='Admin')return response({message:'Admin access required.'},403);const u=await getUser(us[1]);if(!u)return response({message:'User not found.'},404);if(u.id==='admin')return response({message:'Primary admin cannot be suspended.'},400);u.status=u.status==='Active'?'Suspended':'Active';await saveUser(u);return response(projectUser(u));}
  if(path==='/records'&&req.method==='GET')return response(await recordsList(auth!.role));
  if(path==='/candidates'&&req.method==='GET')return response(await candidateList(auth!.role));
  const cs=path.match(/^\/candidates\/([^/]+)\/stage$/);if(cs&&req.method==='PUT'){if(auth!.role!=='Admin')return response({message:'Admin access required.'},403);const b=await req.json();const stage=Number(b.stage);if(!Number.isInteger(stage)||stage<0||stage>3)return response({message:'Stage must be 0-3.'},400);await updateCandidatesDb(cs[1],{stage});return response({ok:true});}
  const cst=path.match(/^\/candidates\/([^/]+)\/status$/);if(cst&&req.method==='GET'){const db=await getDb();const c=db?await db.collection<Candidate>('candidates').findOne({id:cst[1]}):mem.candidates.get(cst[1]);if(!c)return response({message:'Candidate not found.'},404);if(c.stage<3&&c.stage%2===0)await updateCandidatesDb(c.id,{stage:c.stage+1});const fresh=db?await db.collection<Candidate>('candidates').findOne({id:c.id}):mem.candidates.get(c.id);return response({stage:fresh?.stage??c.stage,score:fresh?.score??c.score});}
  if(path==='/audit'&&req.method==='GET'){if(auth!.role!=='Admin')return response({message:'Admin access required.'},403);const count=Math.min(Math.max(Number(url.searchParams.get('count')||'10000'),1),10000);return response(audit(count));}
  return response({message:'Not found'},404);
 }catch(e){console.error(e);return response({message:'Server error. Check the function logs.'},500);}
};
