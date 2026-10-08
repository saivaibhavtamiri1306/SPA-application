import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SceneComponent } from '../../shared/components/scene.component';
import { ToastComponent } from '../../shared/components/toast.component';

@Component({ selector: 'tv-auth-shell', standalone: true, imports: [RouterOutlet, SceneComponent, ToastComponent], template: `
<div class="auth-root"><tv-scene /><div class="noise-overlay"></div><div class="hex-overlay"></div><div class="auth-content"><router-outlet /></div><tv-toast /></div>` })
export class AuthShellComponent {}
