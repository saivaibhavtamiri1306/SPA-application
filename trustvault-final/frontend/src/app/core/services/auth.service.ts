import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthSession, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSubject = new BehaviorSubject<User | null>(this.readUser());
  readonly user$ = this.userSubject.asObservable();
  private pendingMfaToken: string | null = null;

  constructor(private readonly api: ApiService) {}

  login(userId: string, password: string, role: string): Observable<{ preAuthToken: string; user: User }> {
    return this.api.post<{ preAuthToken: string; user: User }>('/auth/login', { userId, password, role }).pipe(
      tap(response => { this.pendingMfaToken = response.preAuthToken; localStorage.setItem('tv_pending_mfa', response.preAuthToken); })
    );
  }

  completeMfa(otp: string): Observable<AuthSession> {
    const token = this.pendingMfaToken || localStorage.getItem('tv_pending_mfa');
    return this.api.post<AuthSession>('/auth/mfa', { otp, preAuthToken: token }).pipe(
      tap(session => {
        localStorage.setItem('tv_token', session.token);
        localStorage.setItem('tv_user', JSON.stringify(session.user));
        localStorage.removeItem('tv_pending_mfa');
        this.pendingMfaToken = null;
        this.userSubject.next(session.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('tv_token');
    localStorage.removeItem('tv_user');
    localStorage.removeItem('tv_pending_mfa');
    this.pendingMfaToken = null;
    this.userSubject.next(null);
  }

  token(): string | null { return localStorage.getItem('tv_token'); }
  currentUser(): User | null { return this.userSubject.value; }
  isLoggedIn(): boolean { return !!this.token() && !!this.currentUser(); }

  private readUser(): User | null {
    try { return JSON.parse(localStorage.getItem('tv_user') || 'null') as User | null; }
    catch { return null; }
  }
}
