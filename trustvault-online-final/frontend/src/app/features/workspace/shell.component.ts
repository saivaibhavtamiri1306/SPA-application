import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { I18nService } from '../../core/services/i18n.service';
import { ThreeBackgroundComponent } from '../../shared/three-background.component';

@Component({
  selector: 'tv-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ThreeBackgroundComponent],
  templateUrl: './shell.component.html'
})
export class ShellComponent {
  readonly auth = inject(AuthService); 
  readonly api = inject(ApiService); 
  readonly i18n = inject(I18nService); 
  private readonly router = inject(Router);
  
  @HostListener('document:mousemove') onActivity() { this.auth.resetIdleTimer(); }
  @HostListener('document:keydown') onKey() { this.auth.resetIdleTimer(); }
  
  // Strictly typed array to satisfy Angular's compiler
  readonly nav: [string, string, string, boolean][] = [
    ['/dashboard', 'NAV.DASH', 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', false],
    ['/records', 'NAV.VAULT', 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4', false],
    ['/users', 'NAV.USERS', 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', true],
    ['/pipeline', 'NAV.PIPE', 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2', true],
    ['/audit', 'NAV.AUDIT', 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', true]
  ];

  toggleOffline(): void { this.api.setOfflineSimulation(!this.api.isOfflineSimulation); }
  
  visible(adminOnly: string | boolean): boolean { 
    return !adminOnly || this.auth.user?.role === 'Admin'; 
  }
  
  logout(): void { this.auth.logout(); }
  title(key: string): string { return this.i18n.t(key) || key; }
}
