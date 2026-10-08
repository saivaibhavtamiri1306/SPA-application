import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../core/services/data.service';
import { ApiService } from '../../../core/services/api.service';
import { AuditEvent } from '../../../core/models/models';
import { ToastService } from '../../../shared/components/toast.component';
import { Subscription } from 'rxjs';

@Component({selector:'tv-audit',standalone:true,imports:[CommonModule],templateUrl:'./audit.component.html'})
export class AuditComponent implements OnInit,OnDestroy{
  events:AuditEvent[]=[]; visible:AuditEvent[]=[];loading=true;hashed=false;hashing=false;progress=0;rendered=0;private readonly subs=new Subscription();private worker?:Worker;
  constructor(private readonly api:ApiService,private readonly toast:ToastService){}
  ngOnInit():void{this.loading=true;this.api.get<AuditEvent[]>('/audit/stream',900).subscribe({next:v=>{this.events=v;this.loading=false;this.updateWindow(0);},error:e=>{this.loading=false;this.toast.show(e?.error?.message||'Audit stream unavailable.','err')}});}
  updateWindow(scrollTop:number):void{const rowH=52, viewH=520,a=Math.max(0,Math.floor(scrollTop/rowH)-4),b=Math.min(this.events.length,Math.ceil((scrollTop+viewH)/rowH)+5);this.visible=this.events.slice(a,b);this.rendered=b-a;}
  onScroll(el:HTMLElement):void{this.updateWindow(el.scrollTop);}
  verifyChain():void{if(this.hashing||!this.events.length)return;this.hashing=true;this.progress=0;this.worker=new Worker(new URL('./audit.worker',import.meta.url),{type:'module'});this.worker.onmessage=({data})=>{if(data.type==='progress'){this.progress=data.pct;}else{this.events=this.events.map((e,i)=>({...e,hash:data.hashes[i]}));this.updateWindow(0);this.hashing=false;this.hashed=true;this.toast.show(`${this.events.length.toLocaleString()} audit entries hashed in ${data.ms}ms using a Web Worker.`,'ok');this.worker?.terminate();this.worker=undefined;}};this.worker.postMessage(this.events.map(e=>`${e.i}|${e.time}|${e.evt}|${e.user}|${e.ip}`));}
  exportCsv():void{const rows=[['#','Time','Event','User','IP','Hash'],...this.events.map(e=>[e.i,e.time,e.evt,e.user,e.ip,e.hash||'not hashed'])];const csv=rows.map(r=>r.map(x=>`"${String(x).replace(/"/g,'""')}"`).join(',')).join('\r\n');const blob=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='trustvault-audit-ledger.csv';a.click();URL.revokeObjectURL(a.href);this.toast.show('Audit CSV exported.','ok');}
  ngOnDestroy():void{this.subs.unsubscribe();this.worker?.terminate();}
}
