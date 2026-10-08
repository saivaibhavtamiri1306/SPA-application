import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({ selector:'tv-scan', standalone:true, imports:[CommonModule], templateUrl:'./scan.component.html', })
export class ScanComponent implements OnInit {
  lines:string[]=[]; progress=0;
  private readonly steps=['Establishing encrypted channel...','Credential signature validated.','Initialising biometric verification layer...','Cross-referencing verification ledger...','Analysing identity consistency...','Applying role policy...','Identity verified.','Minting secure session state...','Unlocking TrustVault workspace...'];
  constructor(private readonly router:Router){}
  ngOnInit():void { this.steps.forEach((s,i)=>setTimeout(()=>{this.lines=[...this.lines,s];this.progress=Math.round((i+1)/this.steps.length*100);},(i+1)*430)); setTimeout(()=>this.router.navigate(['/workspace/dashboard']),this.steps.length*430+850); }
}
