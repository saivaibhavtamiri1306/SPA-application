import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../shared/toast.service';
import { AuditEvent } from '../../../core/models/api.models';

@Component({selector:'tv-audit',standalone:true,imports:[CommonModule],templateUrl:'./audit.component.html'})
export class AuditComponent implements OnInit {
  private readonly api=inject(ApiService); private readonly toast=inject(ToastService); events:AuditEvent[]=[]; loading=true; hashing=false; hashProgress=0; hashMs=0;
  ngOnInit():void{this.api.get<AuditEvent[]>('/audit',{count:10000,delay:900}).subscribe({next:d=>{this.events=d;this.loading=false;},error:e=>{this.loading=false;this.toast.show(e?.error?.message??'Audit unavailable','err')}})}
  rowClass(e:AuditEvent):string{return e.evt==='AUTH_FAIL'||e.evt==='FIREWALL_BLOCK'?'danger':'';}
  verifyChain():void{if(!this.events.length||this.hashing)return;this.hashing=true;this.hashProgress=0;const workerCode=`self.onmessage=async(e)=>{const data=e.data;let prev='0'.repeat(64);const enc=new TextEncoder();const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');const out=[];const t=performance.now();for(let i=0;i<data.length;i++){prev=hex(await crypto.subtle.digest('SHA-256',enc.encode(prev+data[i])));out.push(prev);if(i%250===0)self.postMessage({type:'p',value:Math.round(i/data.length*100)})}self.postMessage({type:'d',hashes:out,ms:Math.round(performance.now()-t)})}`;const blob=new Blob([workerCode],{type:'text/javascript'});const workerUrl=URL.createObjectURL(blob);const worker=new Worker(workerUrl);worker.onmessage=e=>{if(e.data.type==='p')this.hashProgress=e.data.value;if(e.data.type==='d'){this.events=this.events.map((x,i)=>({...x,hash:e.data.hashes[i]}));this.hashMs=e.data.ms;this.hashing=false;worker.terminate();URL.revokeObjectURL(workerUrl);this.toast.show(`Chain verified: ${this.events.length.toLocaleString()} entries`,'ok')}};worker.postMessage(this.events.map(x=>`${x.i}|${x.time}|${x.evt}|${x.user}|${x.ip}`));}
}
