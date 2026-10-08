import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/components/toast.component';

@Component({ selector:'tv-mfa', standalone:true, imports:[CommonModule,FormsModule], templateUrl:'./mfa.component.html', })
export class MfaComponent implements OnDestroy {
  otp=''; seconds=30; busy=false; private timer=setInterval(()=>{ if(this.seconds>0) this.seconds--; },1000);
  constructor(private readonly auth:AuthService, private readonly router:Router, private readonly toast:ToastService){ if(!localStorage.getItem('tv_pending_mfa')) this.router.navigate(['/auth/login']); }
  verify():void { if(this.otp.length!==6 || this.busy) return; if(this.seconds===0){this.toast.show('Verification code expired. Please resend the demo code.','warn');return;} this.busy=true; this.auth.completeMfa(this.otp).subscribe({ next:()=>this.router.navigate(['/auth/scan']), error:err=>{this.busy=false;this.otp='';this.toast.show(err?.error?.message||'Invalid code.','err');} }); }
  onOtpChange(value:string):void { this.otp=String(value||'').replace(/\D/g,'').slice(0,6); }
  demo():void { this.otp='123456'; }
  resend():void { this.seconds=30; this.otp=''; this.toast.show('A new demo code is ready: 123456','info'); }
  ngOnDestroy():void { clearInterval(this.timer); }
}
