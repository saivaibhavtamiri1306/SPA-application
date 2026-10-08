import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Candidate, RecordItem } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private readonly api: ApiService) {}

  records(delay = 1500): Observable<RecordItem[]> { return this.api.get<RecordItem[]>('/records', delay); }
  candidates(delay = 800): Observable<Candidate[]> { return this.api.get<Candidate[]>('/candidates', delay); }
  candidate(id: string, delay = 450): Observable<Candidate> { return this.api.get<Candidate>(`/candidates/${id}`, delay); }
  candidateStatus(id: string, delay = 300): Observable<{ stage: number; score: number }> { return this.api.get(`/candidates/${id}/status`, delay); }
  moveCandidate(id: string, stage: number, delay = 400): Observable<{ ok: boolean }> { return this.api.put(`/candidates/${id}/stage`, { stage }, delay); }
}
