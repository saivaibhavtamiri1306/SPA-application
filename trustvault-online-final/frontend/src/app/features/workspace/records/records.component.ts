import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecordItem } from '../../../core/models/api.models';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../shared/toast.service';
import { jsPDF } from 'jspdf';

@Component({selector:'tv-records',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./records.component.html'})
export class RecordsComponent implements OnInit {
  private readonly api=inject(ApiService); private readonly toast=inject(ToastService); records:RecordItem[]=[]; loading=false; search=''; selected:RecordItem|null=null;
  get filtered():RecordItem[]{const q=this.search.toLowerCase();return this.records.filter(r=>`${r.id} ${r.title} ${r.level} ${r.status}`.toLowerCase().includes(q));}
  ngOnInit():void{this.fetch();}
  fetch():void{this.loading=true;this.api.get<RecordItem[]>('/records',{delay:1500}).subscribe({next:d=>{this.records=d;this.loading=false;},error:e=>{this.loading=false;this.toast.show(e?.error?.message??'Could not load records','err');}})}
  open(r:RecordItem):void{if(r.status==='Locked'){this.toast.show('ACCESS DENIED: Admin clearance required','err');return;}this.selected=r;}
  close():void{this.selected=null;}
  exportCsv():void{const rows=[['File ID','Asset Name','Clearance','Size','Status'],...this.filtered.map(r=>[r.id,r.title,r.level,r.size,r.status])];const csv=rows.map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='trustvault-records.csv';a.click();URL.revokeObjectURL(a.href);this.toast.show('CSV exported','ok');}
  exportPdf():void{if(!this.selected)return;const pdf=new jsPDF();pdf.setFont('helvetica','bold');pdf.setFontSize(18);pdf.text('TRUSTVAULT CORE — RECORD REPORT',18,22);pdf.setFontSize(11);pdf.text(`File ID: ${this.selected.id}`,18,40);pdf.text(`Asset: ${this.selected.title}`,18,50);pdf.text(`Clearance: ${this.selected.level}`,18,60);pdf.text(`Status: ${this.selected.status}`,18,70);pdf.text(`Candidate: ${this.selected.candidateId}`,18,80);pdf.save(`trustvault-${this.selected.id}.pdf`);this.toast.show('PDF report generated','ok');}
}
