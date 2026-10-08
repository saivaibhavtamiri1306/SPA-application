import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/components/toast.component';

@Component({ selector: 'tv-login', standalone: true, imports: [ReactiveFormsModule, RouterLink], templateUrl: './login.component.html' })
export class LoginComponent {
  busy = false; lang: 'en'|'te'|'hi';
  readonly form;
  readonly demo = { admin: { id: 'admin', password: 'admin', role: 'Admin' }, user: { id: 'priya', password: 'priya', role: 'General User' } };
  constructor(private readonly fb: FormBuilder, private readonly auth: AuthService, private readonly router: Router, private readonly toast: ToastService, readonly i18n: LanguageService) {
    this.form = this.fb.nonNullable.group({ userId: ['', [Validators.required]], password: ['', Validators.required], role: ['General User' as 'Admin'|'General User', Validators.required] }); this.lang = i18n.language;
  }
  fill(x: {id:string;password:string;role:'Admin'|'General User'}): void { this.form.setValue({ userId:x.id, password:x.password, role:x.role }); }
  submit(): void {
    if (this.form.invalid || this.busy) return; this.busy = true;
    const f = this.form.getRawValue();
    this.auth.login(f.userId.trim(), f.password.trim(), f.role).subscribe({ next: () => { this.busy=false; this.router.navigate(['/auth/mfa']); }, error: err => { this.busy=false; this.toast.show(err?.error?.message || 'Connection failed.', 'err'); } });
  }
  t(k:string):string { return this.i18n.t(k); }
  setLang(value:string):void { this.i18n.setLanguage(value as 'en'|'te'|'hi'); }
}
