import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, of, switchMap, catchError, startWith, map } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/models';
import { ToastService } from '../../../shared/components/toast.component';

@Component({selector:'tv-users',standalone:true,imports:[CommonModule,ReactiveFormsModule],templateUrl:'./users.component.html'})
export class UsersComponent implements OnInit{
  users:User[]=[];loading=true;showForm=false;editing:User|null=null;available:boolean|null=null;
  readonly form;
  constructor(private readonly fb:FormBuilder,private readonly usersApi:UserService,private readonly toast:ToastService){this.form=this.fb.nonNullable.group({id:['',[Validators.required,Validators.pattern(/^[a-z0-9_]{3,20}$/i)]],name:['',[Validators.required,Validators.minLength(2)]],role:['General User' as 'Admin'|'General User',Validators.required],accessLevel:['Beta (Internal)',Validators.required]});}
  ngOnInit():void{this.load();this.form.controls.id.valueChanges.pipe(startWith(''),debounceTime(350),distinctUntilChanged(),switchMap(v=>v.length>=3?this.usersApi.check(v).pipe(catchError(()=>of(false))):of(null))).subscribe(v=>this.available=v);}
  load():void{this.loading=true;this.usersApi.list().subscribe({next:v=>{this.users=v;this.loading=false;},error:e=>{this.loading=false;this.toast.show(e?.error?.message||'Unable to load users.','err');}})}
  newUser():void{this.editing=null;this.form.reset({id:'',name:'',role:'General User',accessLevel:'Beta (Internal)'});this.available=null;this.showForm=true;}
  edit(u:User):void{this.editing=u;this.form.reset({id:u.id,name:u.name,role:u.role,accessLevel:u.accessLevel});this.available=true;this.showForm=true;}
  save():void{if(this.form.invalid||this.available===false)return;const v=this.form.getRawValue();const obs=this.editing?this.usersApi.update(this.editing.id,{name:v.name,role:v.role,accessLevel:v.accessLevel}):this.usersApi.create(v);obs.subscribe({next:()=>{this.toast.show(this.editing?'Operator profile updated.':'Operator created in XML store.','ok');this.showForm=false;this.load();},error:e=>this.toast.show(e?.error?.message||'Save failed.','err')});}
  toggle(u:User):void{this.usersApi.toggle(u.id).subscribe({next:v=>{this.users=v;this.toast.show(`${u.id} access status changed.`,'ok');},error:e=>this.toast.show(e?.error?.message||'Update failed.','err')});}
  remove(u:User):void{if(u.id==='admin'){this.toast.show('Primary admin cannot be deleted.','warn');return;}if(!confirm(`Delete operator ${u.id}?`))return;this.usersApi.remove(u.id).subscribe({next:()=>{this.toast.show('Operator removed from database.','ok');this.load();},error:e=>this.toast.show(e?.error?.message||'Delete failed.','err')});}
}
