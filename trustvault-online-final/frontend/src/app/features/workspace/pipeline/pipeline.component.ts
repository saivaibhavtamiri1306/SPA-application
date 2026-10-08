import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Candidate, VerificationStage } from '../../../core/models/api.models';
import { ToastService } from '../../../shared/toast.service';

@Component({selector:'tv-pipeline',standalone:true,imports:[CommonModule],templateUrl:'./pipeline.component.html'})
export class PipelineComponent implements OnInit {
  private readonly api=inject(ApiService); private readonly toast=inject(ToastService); candidates:Candidate[]=[]; readonly stages=['Initiated','Queried','Verified','Cleared']; dragging:Candidate|null=null;
  ngOnInit():void{this.load();}
  load():void{this.api.get<Candidate[]>('/candidates',{delay:800}).subscribe({next:d=>this.candidates=d,error:e=>this.toast.show(e?.error?.message??'Pipeline unavailable','err')});}
  byStage(stage:number):Candidate[]{return this.candidates.filter(c=>c.stage===stage);}
  drag(c:Candidate):void{this.dragging=c;}
  allow(event:DragEvent):void{event.preventDefault();}
  drop(event:DragEvent,stage:number):void{event.preventDefault();if(!this.dragging||this.dragging.stage===stage)return;const item=this.dragging;item.stage=stage as VerificationStage;this.dragging=null;this.api.put(`/candidates/${item.id}/stage`,{stage}).subscribe({next:()=>this.toast.show(`${item.name} moved to ${this.stages[stage]}`,'ok'),error:e=>{this.toast.show(e?.error?.message??'Could not save stage','err');this.load();}})}
}
