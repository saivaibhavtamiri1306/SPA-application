import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { AppStateService } from './app-state.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly baseUrl = (globalThis as { __TRUSTVAULT_API__?: string }).__TRUSTVAULT_API__ || 'http://localhost:3000/api';

  constructor(private readonly http: HttpClient, private readonly appState: AppStateService) {}

  get<T>(path: string, delay?: number): Observable<T> {
    const params = delay !== undefined ? new HttpParams().set('delay', delay) : undefined;
    return this.request<T>('GET', path, () => this.http.get<T>(`${this.baseUrl}${path}`, { params }), false);
  }
  post<T>(path: string, body: unknown, delay?: number): Observable<T> {
    const params = delay !== undefined ? new HttpParams().set('delay', delay) : undefined;
    return this.request<T>('POST', path, () => this.http.post<T>(`${this.baseUrl}${path}`, body, { params }), false);
  }
  put<T>(path: string, body: unknown, delay?: number): Observable<T> {
    const params = delay !== undefined ? new HttpParams().set('delay', delay) : undefined;
    return this.request<T>('PUT', path, () => this.http.put<T>(`${this.baseUrl}${path}`, body, { params }), false);
  }
  delete<T>(path: string, delay?: number): Observable<T> {
    const params = delay !== undefined ? new HttpParams().set('delay', delay) : undefined;
    return this.request<T>('DELETE', path, () => this.http.delete<T>(`${this.baseUrl}${path}`, { params }), false);
  }

  private request<T>(method: string, path: string, factory: () => Observable<T>, _unused: boolean): Observable<T> {
    const cacheKey = `tv_http_cache:${method}:${path}`;
    if (this.appState.isOffline && method === 'GET') {
      const raw = localStorage.getItem(cacheKey);
      return raw ? of(JSON.parse(raw) as T) : throwError(() => new Error('No cached data available.'));
    }
    return factory().pipe(
      tap(value => { if (method === 'GET') localStorage.setItem(cacheKey, JSON.stringify(value)); }),
      catchError(err => {
        if (method === 'GET' && err.status >= 500) {
          const cached = localStorage.getItem(cacheKey);
          if (cached) return of(JSON.parse(cached) as T);
        }
        return throwError(() => err);
      })
    );
  }
}
