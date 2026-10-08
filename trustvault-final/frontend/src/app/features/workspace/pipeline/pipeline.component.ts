import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../core/services/data.service';
import { Candidate } from '../../../core/models/models';
import { ToastService } from '../../../shared/components/toast.component';
import { Subscription, interval, startWith, switchMap, catchError, of } from 'rxjs';
import { jsPDF } from 'jspdf';

@Component({selector:'tv-pipeline',standalone:true,imports:[CommonModule],templateUrl:'./pipeline.component.html'})
export class PipelineComponent implements OnInit,OnDestroy{
  stages=['Initiated','Queried','Verified','Cleared']; showPii=false; candidates:Candidate[]=[]; selected:Candidate|null=null; private sub?:Subscription; progress=0;
  constructor(private readonly data:DataService,private readonly toast:ToastService){}
  ngOnInit():void{this.load();}
  load():void{this.data.candidates(800).subscribe({next:v=>this.candidates=v,error:e=>this.toast.show(e?.error?.message||'Pipeline unavailable.','err')});}
  byStage(i:number):Candidate[]{return this.candidates.filter(c=>c.stage===i);}
  dragStart(e:DragEvent,id:string):void{e.dataTransfer?.setData('text/plain',id);}
  dragOver(e:DragEvent):void{e.preventDefault();}
  drop(e:DragEvent,stage:number):void{e.preventDefault();const id=e.dataTransfer?.getData('text/plain')||'';const c=this.candidates.find(x=>x.id===id);if(!c||c.stage===stage)return;const old=c.stage;c.stage=stage;this.data.moveCandidate(id,stage).subscribe({next:()=>this.toast.show(`${c.name} moved to ${this.stages[stage]}.`,'ok'),error:()=>{c.stage=old;this.toast.show('Could not persist stage change.','err')}});}
  open(c:Candidate):void{this.selected={...c};this.progress=c.stage*25+25;this.startPoll(c.id);}
  close():void{this.selected=null;this.showPii=false;this.sub?.unsubscribe();this.sub=undefined;}
  startPoll(id:string):void{this.sub?.unsubscribe();this.sub=interval(3000).pipe(startWith(0),switchMap(()=>this.data.candidateStatus(id,300).pipe(catchError(()=>of(null))))).subscribe(r=>{if(!r||!this.selected)return;this.selected={...this.selected,stage:r.stage,score:r.score};this.progress=Math.min(100,(r.stage+1)*25);const idx=this.candidates.findIndex(x=>x.id===id);if(idx>=0)this.candidates[idx]={...this.candidates[idx],stage:r.stage,score:r.score};});}
  startPii():void{this.showPii=true;}
  stopPii():void{this.showPii=false;}
  reveal(v:string):string{return this.selected?.canReveal && this.showPii?v:v.replace(/\d(?=(?:\D*\d){4})/g,'X');}
  pdf():void{if(!this.selected)return;const d=new jsPDF();d.setFont('courier','bold');d.text('TRUSTVAULT CORE — VERIFICATION REPORT',15,18);d.setFont('courier','normal');d.text(`Candidate: ${this.selected.name}`,15,35);d.text(`Reference: ${this.selected.id}`,15,44);d.text(`Role: ${this.selected.role}`,15,53);d.text(`Integrity Score: ${this.selected.score}%`,15,62);d.text(`Stage: ${this.stages[this.selected.stage]}`,15,71);d.text(`Generated: ${new Date().toLocaleString()}`,15,80);d.save(`${this.selected.id}-verification-report.pdf`);this.toast.show('Verification PDF generated.','ok');}
  ngOnDestroy():void{this.sub?.unsubscribe();}
}
