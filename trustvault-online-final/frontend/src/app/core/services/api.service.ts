import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, throwError, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api';
  private offlineSimulation = false;

  setOfflineSimulation(value: boolean): void { this.offlineSimulation = value; }
  get isOfflineSimulation(): boolean { return this.offlineSimulation; }

  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    const key = `trustvault-cache:${path}:${JSON.stringify(params ?? {})}`;
    if (this.offlineSimulation) {
      const cached = localStorage.getItem(key);
      return cached ? of(JSON.parse(cached) as T) : throwError(() => new Error('Offline and no cached data is available.'));
    }
    let hp = new HttpParams();
    Object.entries(params ?? {}).forEach(([k, v]) => hp = hp.set(k, String(v)));
    return this.http.get<T>(`${this.base}${path}`, { params: hp }).pipe(
      tap(data => localStorage.setItem(key, JSON.stringify(data))),
      catchError(err => {
        const cached = localStorage.getItem(key);
        return cached ? of(JSON.parse(cached) as T) : throwError(() => err);
      })
    );
  }

  getCached<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    const key = `trustvault-cache:${path}:${JSON.stringify(params ?? {})}`;
    return this.get<T>(path, params).pipe(
      catchError(err => {
        const cached = localStorage.getItem(key);
        return cached ? of(JSON.parse(cached) as T) : throwError(() => err);
      })
    );
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.base}${path}`, body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.base}${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.base}${path}`);
  }
}
