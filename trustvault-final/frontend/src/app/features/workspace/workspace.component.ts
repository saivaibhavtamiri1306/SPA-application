import { Component, HostListener, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AppStateService } from '../../core/services/app-state.service';
import { LanguageService } from '../../core/services/language.service';
import { ToastComponent, ToastService } from '../../shared/components/toast.component';
import { SceneComponent } from '../../shared/components/scene.component';

@Component({ selector:'tv-workspace', standalone:true, imports:[CommonModule,RouterOutlet,RouterLink,ToastComponent,SceneComponent], templateUrl:'./workspace.component.html', })
export class WorkspaceComponent implements OnDestroy {
  user=this.auth.currentUser()!; active='dashboard'; offline=false; idleSeconds=0; private sub=new Subscription(); private lastActivity=0; private idleWarning?:ReturnType<typeof setTimeout>; private idleLogout?:ReturnType<typeof setTimeout>;
  nav=[{path:'dashboard',label:'dash',icon:'⌘',admin:false},{path:'records',label:'vault',icon:'▦',admin:false},{path:'users',label:'users',icon:'♙',admin:true},{path:'pipeline',label:'pipeline',icon:'◈',admin:true},{path:'audit',label:'audit',icon:'◌',admin:true}];
  constructor(private readonly auth:AuthService, private readonly router:Router, readonly app:AppStateService, readonly i18n:LanguageService, private readonly toast:ToastService){ this.resetIdle(); this.sub.add(this.router.events.pipe(filter((e):e is NavigationEnd=>e instanceof NavigationEnd)).subscribe(e=>this.active=e.urlAfterRedirects.split('/').pop()||'dashboard')); this.sub.add(this.app.offline$.subscribe(v=>this.offline=v)); }
  t(k:string):string{return this.i18n.t(k);} setLang(v:string):void{this.i18n.setLanguage(v as 'en'|'te'|'hi');} toggleServer():void{this.app.toggleOffline();this.toast.show(this.app.isOffline?'Server switched off — cached GET data will be used.':'Server mode restored.','info');}
  go(path:string):void{this.router.navigate(['/workspace',path]);} logout():void{this.auth.logout();this.router.navigate(['/auth/login']);}
  resetIdle():void{clearTimeout(this.idleWarning);clearTimeout(this.idleLogout);this.idleSeconds=0;this.idleWarning=setTimeout(()=>{this.idleSeconds=10;this.idleLogout=setTimeout(()=>{this.toast.show('Session locked after 60 seconds of inactivity.','warn');this.logout();},10000);},50000);}
  @HostListener('window:mousemove') onActivity():void{const now=Date.now();if(now-this.lastActivity<1000)return;this.lastActivity=now;this.resetIdle();}
  @HostListener('window:keydown') onKey():void{this.resetIdle();}
  @HostListener('window:click') onClick():void{this.resetIdle();}
  @HostListener('window:touchstart') onTouch():void{this.resetIdle();}
  ngOnDestroy():void{this.sub?.unsubscribe();clearTimeout(this.idleWarning);clearTimeout(this.idleLogout);}
}
