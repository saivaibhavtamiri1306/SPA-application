import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { I18nService } from '../../core/services/i18n.service';
import { ThreeBackgroundComponent } from '../../shared/three-background.component';

@Component({selector:'tv-shell',standalone:true,imports:[CommonModule,RouterOutlet,RouterLink,RouterLinkActive,ThreeBackgroundComponent],templateUrl:'./shell.component.html'})
export class ShellComponent {
  readonly auth=inject(AuthService); readonly api=inject(ApiService); readonly i18n=inject(I18nService); private readonly router=inject(Router);
  @HostListener('document:mousemove') onActivity(){this.auth.resetIdleTimer();}
  @HostListener('document:keydown') onKey(){this.auth.resetIdleTimer();}
  readonly nav=[['/dashboard','◈','dashboard'],['/records','▣','records'],['/users','♙','users'],['/pipeline','⌁','pipeline'],['/audit','≋','audit'],['/profile','⚙','profile']];
  toggleOffline():void{this.api.setOfflineSimulation(!this.api.isOfflineSimulation);}
  visible(path:string):boolean{return !['/users','/pipeline','/audit'].includes(path)||this.auth.user?.role==='Admin';}
  logout():void{this.auth.logout();}
  title(key:string):string{return this.i18n.t(key);}
}
