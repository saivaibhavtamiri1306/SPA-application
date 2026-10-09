import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { ToastService } from '../../shared/toast.service';
import { Router } from '@angular/router';
import { UserRole } from '../../core/models/api.models';
import { ThreeBackgroundComponent } from '../../shared/three-background.component';

@Component({
  selector: 'tv-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ThreeBackgroundComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder); 
  private readonly auth = inject(AuthService); 
  private readonly router = inject(Router); 
  private readonly toast = inject(ToastService); 
  readonly i18n = inject(I18nService);

  step: 1 | 2 | 3 | 4 = 1; // 1: Login, 2: OTP, 3: Scan, 4: Success
  busy = false; 
  error = ''; 
  otp = ''; 
  cooldown = 30; 
  logs: string[] = [];
  
  private timer?: ReturnType<typeof setInterval>; 
  private scanTimers: ReturnType<typeof setTimeout>[] = [];
  private pendingUser: UserRole = 'General User';

  form = this.fb.nonNullable.group({
    id: ['', Validators.required],
    password: ['', Validators.required],
    role: ['General User' as UserRole, Validators.required]
  });

  readonly demo = {
    admin: { id: 'admin', password: 'admin', role: 'Admin' as UserRole },
    user: { id: 'priya', password: 'priya', role: 'General User' as UserRole }
  };

  fill(x: { id: string; password: string; role: UserRole }): void {
    this.form.setValue(x);
  }

  submit(): void {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy = true;
    this.pendingUser = this.form.controls.role.value;
    
    this.auth.login({
      userId: this.form.controls.id.value,
      password: this.form.controls.password.value,
      role: this.form.controls.role.value
    }).subscribe({
      next: () => {
        this.step = 2;
        this.busy = false;
        this.otp = '';
        this.startCooldown();
      },
      error: (err) => {
        this.busy = false;
        this.error = err?.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }

  otpInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 6);
    this.otp = value;
    
    if (value.length !== 6 || this.busy) return;
    if (this.cooldown === 0) {
      this.error = 'Code expired. Please resend a new one.';
      this.otp = '';
      return;
    }

    this.busy = true;
    this.auth.verifyMfa(value).subscribe({
      next: (response) => {
        this.auth.completeLogin(response);
        this.startScan();
      },
      error: (err) => {
        this.busy = false;
        this.error = err?.error?.message || 'Invalid OTP. Please try again.';
        this.otp = '';
      }
    });
  }

  resend(): void {
    this.otp = '';
    this.cooldown = 30;
    this.error = '';
    this.startCooldown();
    this.toast.show('Demo code renewed: 123456', 'info');
  }

  private startCooldown(): void {
    clearInterval(this.timer);
    this.cooldown = 30;
    this.timer = setInterval(() => {
      this.cooldown = Math.max(0, this.cooldown - 1);
      if (this.cooldown === 0) clearInterval(this.timer);
    }, 1000);
  }

  private startScan(): void {
    this.busy = false;
    this.step = 3;
    this.logs = [];
    clearInterval(this.timer);

    const sequence = [
      'Verifying credential hash...',
      'Hash match confirmed.',
      'Initializing biometric retinal scanner...',
      'Scanning retina topography...',
      'Analyzing genetic encryption markers...',
      'Cross-referencing quantum ledger...',
      'IDENTITY VERIFIED.',
      'Generating secure session token...',
      'Decrypting primary vault access...'
    ];

    sequence.forEach((msg, i) => {
      this.scanTimers.push(setTimeout(() => {
        const time = new Date().toISOString().split('T')[1].slice(0, -1);
        this.logs.unshift(`[${time}] ${msg}`); // unshift puts latest on top
      }, (i + 1) * 400));
    });

    this.scanTimers.push(setTimeout(() => {
      this.step = 4;
      setTimeout(() => this.router.navigateByUrl('/dashboard'), 1500);
    }, sequence.length * 400 + 800));
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.scanTimers.forEach(t => clearTimeout(t));
  }
}
