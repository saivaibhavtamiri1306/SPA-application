import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, throwError, tap, delay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api';
  private offlineSimulation = false;

  // Mock Data mimicking the HTML demo
  private readonly CAND = [
    { id: 'C-101', name: 'Ananya Rao', role: 'Backend Engineer', aadhaar: '[Aadhaar Redacted]', phone: '+91 98765 43210', score: 96, stage: 3 },
    { id: 'C-102', name: 'Rohit Verma', role: 'DevOps Engineer', aadhaar: '[Aadhaar Redacted]', phone: '+91 91234 56780', score: 88, stage: 2 },
    { id: 'C-103', name: 'Sneha Kulkarni', role: 'QA Analyst', aadhaar: '[Aadhaar Redacted]', phone: '+91 99887 76655', score: 79, stage: 1 },
    { id: 'C-104', name: 'Arjun Mehta', role: 'Security Analyst', aadhaar: '[Aadhaar Redacted]', phone: '+91 90000 11122', score: 91, stage: 0 },
    { id: 'C-105', name: 'Divya Nair', role: 'Data Scientist', aadhaar: '[Aadhaar Redacted]', phone: '+91 98450 22110', score: 84, stage: 1 },
    { id: 'C-106', name: 'Karthik Reddy', role: 'Frontend Engineer', aadhaar: '[Aadhaar Redacted]', phone: '+91 97000 33445', score: 72, stage: 0 },
    { id: 'C-107', name: 'Meera Iyer', role: 'Product Designer', aadhaar: '[Aadhaar Redacted]', phone: '+91 96000 77889', score: 93, stage: 2 },
    { id: 'C-108', name: 'Vikram Singh', role: 'Cloud Architect', aadhaar: '[Aadhaar Redacted]', phone: '+91 95000 99001', score: 67, stage: 0 }
  ];

  setOfflineSimulation(value: boolean): void { this.offlineSimulation = value; }
  get isOfflineSimulation(): boolean { return this.offlineSimulation; }

  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    const key = `trustvault-cache:${path}:${JSON.stringify(params ?? {})}`;
    
    // Intercept Mock Data calls to avoid failing without a real Node backend
    if (path === '/candidates') return of(this.CAND as T).pipe(delay(800));

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

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.base}${path}`, body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.base}${path}`, body);
  }
}
