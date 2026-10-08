import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private readonly api: ApiService) {}
  list(): Observable<User[]> { return this.api.get<User[]>('/users', 1000); }
  check(id: string): Observable<boolean> { return this.api.get<{ exists: boolean }>(`/users/check/${encodeURIComponent(id)}`, 300).pipe(map(x => !x.exists)); }
  create(body: Pick<User, 'id' | 'name' | 'role' | 'accessLevel'>): Observable<User> { return this.api.post<User>('/users', body, 700); }
  update(id: string, body: Partial<User>): Observable<User> { return this.api.put<User>(`/users/${encodeURIComponent(id)}`, body, 700); }
  toggle(id: string): Observable<User[]> { return this.api.put<User[]>(`/users/${encodeURIComponent(id)}/status`, {}, 800); }
  remove(id: string): Observable<{ ok: boolean }> { return this.api.delete(`/users/${encodeURIComponent(id)}`, 700); }

}
