import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { LoginRequest, LoginResponse, MfaResponse, User } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly userSubject = new BehaviorSubject<User | null>(this.readUser());
  private mfaToken: string | null = null;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;

  readonly user$ = this.userSubject.asObservable();

  get user(): User | null { return this.userSubject.value; }
  get token(): string | null { return localStorage.getItem('tv_access_token'); }
  get loggedIn(): boolean { return !!this.token && !!this.user; }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('/auth/login', payload).pipe(tap(result => this.mfaToken = result.mfaToken));
  }

  verifyMfa(otp: string): Observable<MfaResponse> {
    return this.api.post<MfaResponse>('/auth/mfa', { otp, mfaToken: this.mfaToken });
  }

  completeLogin(response: MfaResponse): void {
    localStorage.setItem('tv_access_token', response.token);
    localStorage.setItem('tv_user', JSON.stringify(response.user));
    this.mfaToken = null;
    this.userSubject.next(response.user);
    this.resetIdleTimer();
  }

  logout(reason?: string): void {
    localStorage.removeItem('tv_access_token');
    localStorage.removeItem('tv_user');
    this.mfaToken = null;
    this.clearIdleTimer();
    this.userSubject.next(null);
    this.router.navigateByUrl('/login', reason ? { state: { reason } } : undefined);
  }

  refreshUser(user: User): void {
    localStorage.setItem('tv_user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  resetIdleTimer(): void {
    if (!this.loggedIn) return;
    this.clearIdleTimer();
    this.idleTimer = setTimeout(() => this.logout('Session locked after 60 seconds of inactivity.'), 60_000);
  }

  clearIdleTimer(): void { if (this.idleTimer) clearTimeout(this.idleTimer); this.idleTimer = null; }

  private readUser(): User | null {
    try { return JSON.parse(localStorage.getItem('tv_user') ?? 'null') as User | null; } catch { return null; }
  }
}
