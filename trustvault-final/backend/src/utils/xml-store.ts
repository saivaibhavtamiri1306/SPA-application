import fs from 'node:fs/promises';
import path from 'node:path';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

export interface Store { users:any[]; candidates:any[]; records:any[]; audit:any[]; }
const file=path.resolve(process.cwd(),'data/store.xml');
const builder=new XMLBuilder({ignoreAttributes:false,format:true,indentBy:'  '});
const parser=new XMLParser({ignoreAttributes:false,isArray:(name)=>['user','candidate','record','event'].includes(name)});

export async function ensureStore(seed:Store):Promise<void>{try{await fs.access(file);}catch{await fs.mkdir(path.dirname(file),{recursive:true});await saveStore(seed);}}
export async function readStore():Promise<Store>{const xml=await fs.readFile(file,'utf8');const raw=parser.parse(xml).trustvault||{};return {users:raw.users?.user||[],candidates:raw.candidates?.candidate||[],records:raw.records?.record||[],audit:raw.audit?.event||[]};}
export async function saveStore(store:Store):Promise<void>{const xml=builder.build({trustvault:{users:{user:store.users},candidates:{candidate:store.candidates},records:{record:store.records},audit:{event:store.audit}}});const tmp=file+'.tmp';await fs.writeFile(tmp,xml,'utf8');await fs.rename(tmp,file);}
