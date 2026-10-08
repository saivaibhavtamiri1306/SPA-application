import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { Candidate, RecordItem } from '../../../core/models/models';
import { ToastService } from '../../../shared/components/toast.component';
import { jsPDF } from 'jspdf';

@Component({ selector:'tv-records', standalone:true, imports:[CommonModule,FormsModule], templateUrl:'./records.component.html', })
export class RecordsComponent implements OnInit {
  records:RecordItem[]=[]; loading=true; search=''; filter='All'; statusFilter='All'; selected:RecordItem|null=null; selectedCandidate:Candidate|null=null; decrypting=false; progress=0; private progressTimer?:ReturnType<typeof setInterval>;
  constructor(private readonly data:DataService, private readonly toast:ToastService){}
  ngOnInit():void{this.fetch();}
  fetch():void{this.loading=true;this.progress=0;clearInterval(this.progressTimer);this.progressTimer=setInterval(()=>{this.progress=Math.min(94,this.progress+Math.round(Math.random()*7+3));},70);this.data.records(1500).subscribe({next:v=>{clearInterval(this.progressTimer);this.progress=100;setTimeout(()=>{this.records=v;this.loading=false;},260);},error:e=>{clearInterval(this.progressTimer);this.loading=false;this.toast.show(e?.error?.message||'Unable to load records.','err');}})}
  get filtered():RecordItem[]{const q=this.search.toLowerCase().trim();return this.records.filter(r=>(this.filter==='All'||r.level===this.filter)&&(this.statusFilter==='All'||(this.statusFilter==='Locked')===(r.status==='Locked'))&&(!q||`${r.id} ${r.title} ${r.candidateId}`.toLowerCase().includes(q)));}
  open(r:RecordItem):void{if(r.status==='Locked'){this.toast.show('ACCESS DENIED: Admin clearance is required.','err');return;}this.selected=r;this.selectedCandidate=null;this.data.candidate(r.candidateId,500).subscribe({next:c=>this.selectedCandidate=c});}
  close():void{this.selected=null;this.selectedCandidate=null;}
  simulateDecrypt():void{this.decrypting=true;this.progress=0;const t=setInterval(()=>{this.progress=Math.min(100,this.progress+Math.round(Math.random()*8+6));if(this.progress>=100){clearInterval(t);this.decrypting=false;this.toast.show('Record chain decrypted and cached.','ok');}},100);}
  mask(value:string):string{return [...value].map((c,i)=>/\d/.test(c)&&i<Math.max(0,value.length-4)?'•':c).join('');}
  exportCsv():void{const cell=(v:string)=>`"${String(v).replace(/"/g,'""')}"`;const csv=[['File ID','Asset Name','Clearance','Size','Status'],...this.filtered.map(r=>[r.id,r.title,r.level,r.size,r.status])].map(row=>row.map(cell).join(',')).join('\r\n');this.download('trustvault-records.csv','text/csv;charset=utf-8',csv);this.toast.show(`Exported ${this.filtered.length} records.`,'ok');}
  exportSelectedPdf():void{if(!this.selected)return;const d=new jsPDF();d.setFont('courier','bold');d.text('TRUSTVAULT CORE — RECORD REPORT',15,18);d.setFont('courier','normal');d.text(`Record: ${this.selected.id}`,15,34);d.text(`Asset: ${this.selected.title}`,15,43);d.text(`Clearance: ${this.selected.level}`,15,52);d.text(`Status: ${this.selected.status}`,15,61);if(this.selectedCandidate){d.text(`Candidate: ${this.selectedCandidate.name}`,15,70);d.text(`Integrity: ${this.selectedCandidate.score}%`,15,79);}d.save(`${this.selected.id}-report.pdf`);this.toast.show('Record PDF report generated.','ok');}
  exportPdf():void{const doc=new jsPDF();doc.setFont('courier','bold');doc.text('TRUSTVAULT CORE — DATA VAULT REPORT',14,18);doc.setFont('courier','normal');let y=30;this.filtered.slice(0,20).forEach(r=>{doc.text(`${r.id} | ${r.title.slice(0,32)} | ${r.level} | ${r.status}`,14,y);y+=8;if(y>280){doc.addPage();y=18;}});doc.save('trustvault-report.pdf');this.toast.show('PDF report generated.','ok');}
  private download(name:string,type:string,text:string):void{const blob=new Blob([text],{type});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href);}
}
