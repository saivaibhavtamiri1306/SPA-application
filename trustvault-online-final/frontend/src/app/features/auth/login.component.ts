import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { ToastService } from '../../shared/toast.service';
import { Router } from '@angular/router';
import { UserRole } from '../../core/models/api.models';
import { ThreeBackgroundComponent } from '../../shared/three-background.component';

@Component({selector:'tv-login',standalone:true,imports:[CommonModule,ReactiveFormsModule,ThreeBackgroundComponent],templateUrl:'./login.component.html'})
export class LoginComponent {
  private readonly fb=inject(FormBuilder); private readonly auth=inject(AuthService); private readonly router=inject(Router); private readonly toast=inject(ToastService); readonly i18n=inject(I18nService);
  step:1|2|3=1; busy=false; error=''; otp=''; cooldown=30; private timer?:ReturnType<typeof setInterval>; private pendingUser:UserRole='General User';
  form=this.fb.nonNullable.group({id:['',Validators.required],password:['',Validators.required],role:['General User' as UserRole,Validators.required]});
  readonly demo={admin:{id:'admin',password:'admin',role:'Admin' as UserRole},user:{id:'priya',password:'priya',role:'General User' as UserRole}};
  fill(x:{id:string;password:string;role:UserRole}):void{this.form.setValue(x);}
  submit():void{this.error='';if(this.form.invalid){this.form.markAllAsTouched();return;}this.busy=true;this.pendingUser=this.form.controls.role.value;const {id:userId,password,role}=this.form.getRawValue();this.auth.login({userId,password,role}).subscribe({next:()=>{this.busy=false;this.step=2;this.startCooldown();},error:e=>{this.busy=false;this.error=e?.error?.message??'Unable to sign in.';}})}
  otpInput(event:Event):void{const value=(event.target as HTMLInputElement).value.replace(/\D/g,'').slice(0,6);this.otp=value;if(value.length!==6||this.busy)return;this.busy=true;this.auth.verifyMfa(value).subscribe({next:r=>{this.busy=false;clearInterval(this.timer);this.step=3;setTimeout(()=>{this.auth.completeLogin(r);this.router.navigateByUrl('/dashboard');},2200);},error:e=>{this.busy=false;this.error=e?.error?.message??'Verification failed.';this.otp='';}})}
  resend():void{this.otp='';this.cooldown=30;this.error='';this.startCooldown();this.toast.show('Demo code renewed: 123456','info');}
  private startCooldown():void{clearInterval(this.timer);this.cooldown=30;this.timer=setInterval(()=>{this.cooldown=Math.max(0,this.cooldown-1);if(this.cooldown===0)clearInterval(this.timer);},1000);}
}
