import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/toast.service';
import { AccessLevel, User, UserRole } from '../../../core/models/api.models';

@Component({selector:'tv-users',standalone:true,imports:[CommonModule,ReactiveFormsModule],templateUrl:'./users.component.html'})
export class UsersComponent implements OnInit {
  private readonly api=inject(ApiService); private readonly fb=inject(FormBuilder); private readonly toast=inject(ToastService); readonly auth=inject(AuthService);
  users:User[]=[]; loading=true; showForm=false; editingId:string|null=null;
  form=this.fb.nonNullable.group({id:['',[Validators.required,Validators.minLength(3)]],name:['',[Validators.required,Validators.minLength(2)]],role:['General User' as UserRole,Validators.required],accessLevel:['Beta (Internal)' as AccessLevel,Validators.required]});
  ngOnInit():void{this.load();}
  load():void{this.loading=true;this.api.get<User[]>('/users',{delay:700}).subscribe({next:d=>{this.users=d;this.loading=false;},error:e=>{this.loading=false;this.toast.show(e?.error?.message??'Unable to load users','err');}})}
  edit(u:User):void{this.editingId=u.id;this.showForm=true;this.form.setValue({id:u.id,name:u.name,role:u.role,accessLevel:u.accessLevel});this.form.controls.id.disable();}
  create():void{this.editingId=null;this.showForm=true;this.form.reset({id:'',name:'',role:'General User',accessLevel:'Beta (Internal)'});this.form.controls.id.enable();}
  cancel():void{this.showForm=false;this.editingId=null;}
  save():void{if(this.form.invalid)return;const raw=this.form.getRawValue();this.loading=true;if(this.editingId){this.api.put<User>(`/users/${this.editingId}`,{name:raw.name,role:raw.role,accessLevel:raw.accessLevel}).subscribe({next:u=>{this.users=this.users.map(x=>x.id===u.id?u:x);this.loading=false;this.cancel();this.toast.show('Operator updated','ok');},error:e=>{this.loading=false;this.toast.show(e?.error?.message??'Update failed','err')}})}else{this.api.post<User>('/users',{id:raw.id,name:raw.name,role:raw.role,accessLevel:raw.accessLevel}).subscribe({next:u=>{this.users=[...this.users,u];this.loading=false;this.cancel();this.toast.show('Operator created','ok');},error:e=>{this.loading=false;this.toast.show(e?.error?.message??'Create failed','err')}})}}
  toggle(u:User):void{if(u.id==='admin'){this.toast.show('Primary admin cannot be suspended','warn');return;}this.api.put<User>(`/users/${u.id}/status`,{}).subscribe({next:r=>{this.users=this.users.map(x=>x.id===r.id?r:x);this.toast.show(`${r.name} is now ${r.status}`,'ok');},error:e=>this.toast.show(e?.error?.message??'Status update failed','err')});}
  remove(u:User):void{if(!confirm(`Delete ${u.name}?`))return;this.api.delete<{ok:boolean}>(`/users/${u.id}`).subscribe({next:()=>{this.users=this.users.filter(x=>x.id!==u.id);this.toast.show('Operator deleted','ok');},error:e=>this.toast.show(e?.error?.message??'Delete failed','err')});}
}
