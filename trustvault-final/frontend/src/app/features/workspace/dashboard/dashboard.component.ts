import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterStagePipe } from './filter-stage.pipe';
import { forkJoin, interval, Subscription, switchMap, startWith, catchError, of } from 'rxjs';
import { DataService } from '../../../core/services/data.service';
import { AuthService } from '../../../core/services/auth.service';
import { Candidate, RecordItem } from '../../../core/models/models';
import { ToastService } from '../../../shared/components/toast.component';

@Component({ selector:'tv-dashboard', standalone:true, imports:[CommonModule, FilterStagePipe], templateUrl:'./dashboard.component.html', })
export class DashboardComponent implements OnInit, OnDestroy {
  user=this.auth.currentUser()!; loading=true; candidates:Candidate[]=[]; records:RecordItem[]=[]; live:Candidate[]=[]; avg=0; verified=0; pending=0; rejected=0; private sub?:Subscription; widgets=new Set(['gauge','heatmap','graph','feed']);
  constructor(private readonly data:DataService, private readonly auth:AuthService, private readonly toast:ToastService){}
  ngOnInit():void{
    forkJoin({candidates:this.data.candidates(800).pipe(catchError(()=>of([]))),records:this.data.records(1200).pipe(catchError(()=>of([])))}).subscribe(v=>{this.candidates=v.candidates;this.records=v.records;this.live=v.candidates;this.avg=v.candidates.length?Math.round(v.candidates.reduce((s,c)=>s+c.score,0)/v.candidates.length):0;this.verified=v.candidates.filter(c=>c.stage>=3).length;this.pending=v.candidates.filter(c=>c.stage>0&&c.stage<3).length;this.rejected=v.candidates.filter(c=>c.score<70).length;this.loading=false;});
    this.sub=interval(4000).pipe(startWith(0),switchMap(()=>this.data.candidates(250).pipe(catchError(()=>of(this.live))))).subscribe(v=>this.live=v);
  }
  track(_:number,x:Candidate):string{return x.id;}
  removeWidget(id:string):void{this.widgets.delete(id);this.toast.show(`${id.toUpperCase()} widget removed from workspace.`,'info');}
  addWidget():void{(['gauge','heatmap','graph','feed'] as const).find(id=>!this.widgets.has(id)) ? this.widgets.add((['gauge','heatmap','graph','feed'] as const).find(id=>!this.widgets.has(id))!) : this.toast.show('All dashboard widgets are already active.','info');}
  stageName(n:number):string{return ['Initiated','Queried','Verified','Cleared'][n]||'Cleared';}
  ngOnDestroy():void{this.sub?.unsubscribe();}
}
