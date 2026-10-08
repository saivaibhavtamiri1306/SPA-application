import { ensureStore, readStore, saveStore, type Store } from '../utils/xml-store.js';
import { hashPassword } from '../utils/security.js';

const seed:Store={
 users:[
  {id:'admin',name:'Alex Admin',role:'Admin',accessLevel:'Omega (Full)',status:'Active',passwordHash:hashPassword('admin')},
  {id:'priya',name:'Priya Sharma',role:'General User',accessLevel:'Beta (Internal)',status:'Active',passwordHash:hashPassword('priya')}
 ],
 candidates:[
  {id:'C-101',name:'Ananya Rao',role:'Backend Engineer',aadhaar:'4821 7733 9051',phone:'+91 98765 43210',score:96,stage:3,polls:0},
  {id:'C-102',name:'Rohit Verma',role:'DevOps Engineer',aadhaar:'3012 5588 1146',phone:'+91 91234 56780',score:88,stage:2,polls:0},
  {id:'C-103',name:'Sneha Kulkarni',role:'QA Analyst',aadhaar:'7745 2210 6683',phone:'+91 99887 76655',score:79,stage:1,polls:0},
  {id:'C-104',name:'Arjun Mehta',role:'Security Analyst',aadhaar:'5509 1274 3320',phone:'+91 90000 11122',score:91,stage:0,polls:0},
  {id:'C-105',name:'Divya Nair',role:'Data Scientist',aadhaar:'2288 9041 7765',phone:'+91 98450 22110',score:84,stage:1,polls:0},
  {id:'C-106',name:'Karthik Reddy',role:'Frontend Engineer',aadhaar:'6630 4417 8802',phone:'+91 97000 33445',score:72,stage:0,polls:0},
  {id:'C-107',name:'Meera Iyer',role:'Product Designer',aadhaar:'1194 6650 2237',phone:'+91 96000 77889',score:93,stage:2,polls:0},
  {id:'C-108',name:'Vikram Singh',role:'Cloud Architect',aadhaar:'8841 3029 5571',phone:'+91 95000 99001',score:67,stage:0,polls:0}
 ],
 records:[
  {id:'REC-77A1',title:'Public Protocol Guidelines',level:'Public',status:'Decrypted',size:'1.2 MB',candidateId:'C-101'},
  {id:'REC-77B2',title:'System Architecture Map',level:'Internal',status:'Decrypted',size:'14.5 MB',candidateId:'C-102'},
  {id:'REC-77C3',title:'Employee Network Logs',level:'Internal',status:'Decrypted',size:'256 MB',candidateId:'C-103'},
  {id:'REC-88D4',title:'Quantum Encryption Keys [Q3]',level:'Confidential',status:'Encrypted',size:'0.5 KB',candidateId:'C-104'},
  {id:'REC-88E5',title:'Zero-Day Vulnerability Report',level:'Confidential',status:'Encrypted',size:'4.1 MB',candidateId:'C-105'},
  {id:'REC-99F6',title:'Project Oversight Source',level:'Confidential',status:'Encrypted',size:'2.4 GB',candidateId:'C-106'}
 ],
 audit:[]
};
function makeAudit(){const ev=['AUTH_SUCCESS','DATA_READ','AUTH_FAIL','FIREWALL_BLOCK','POLICY_UPDATE','KEY_ROTATE','EXPORT_PDF','SESSION_END'];const users=['admin','priya','SYSTEM','UNKNOWN','ananya','rohit'];return Array.from({length:10000},(_,i)=>({i,time:new Date(Date.UTC(2026,9,1)+i*37000).toISOString().replace('T',' ').slice(0,19),evt:ev[(i*13)%ev.length],user:users[(i*7)%users.length],ip:`${10+(i%200)}.${i%255}.${(i*17)%255}.${1+(i%254)}`,hash:''}));}
seed.audit=makeAudit();

export class TrustVaultRepository{
  private ready?:Promise<void>;
  async init():Promise<void>{this.ready??=ensureStore(seed);await this.ready;}
  async get():Promise<Store>{await this.init();return readStore();}
  async save(store:Store):Promise<void>{await saveStore(store);}
  async findUser(id:string):Promise<any|undefined>{return (await this.get()).users.find(u=>String(u.id).toLowerCase()===id.toLowerCase());}
  public userView(user:any){const {passwordHash,...safe}=user;return safe;}
  public mask(value:string){return value.replace(/\d(?=(?:\D*\d){4})/g,'X');}
  public candidateView(c:any,admin:boolean){return {...c,aadhaar:admin?c.aadhaar:this.mask(c.aadhaar),phone:admin?c.phone:this.mask(c.phone),canReveal:admin};}
}
export const repository=new TrustVaultRepository();
