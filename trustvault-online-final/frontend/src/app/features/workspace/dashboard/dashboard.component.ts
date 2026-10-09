import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Candidate } from '../../../core/models/api.models';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'tv-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService); 
  readonly auth = inject(AuthService); 
  readonly toast = inject(ToastService);
  
  candidates: Candidate[] = []; 
  loading = true; 
  widgets = new Set(['gauge', 'heatmap', 'graph', 'feed']); 
  readonly stages = ['Initiated', 'Queried', 'Verified', 'Cleared']; 
  readonly heatmapCells = Array.from({ length: 30 }, (_, i) => i);
  
  get averageScore(): number { return this.candidates.length ? Math.round(this.candidates.reduce((s, c) => s + c.score, 0) / this.candidates.length) : 0; }
  get topCandidates(): Candidate[] { return [...this.candidates].sort((a, b) => b.score - a.score).slice(0, 3); }
  
  stageCount(stage: number): number { return this.candidates.filter(c => c.stage === stage).length; }
  bar(stage: number): number { return this.candidates.length ? Math.round(this.stageCount(stage) / this.candidates.length * 100) : 0; }
  
  heatClass(i: number): string { 
    // Pseudo-random distribution similar to the HTML demo heatmap
    const n = (i * 7 + 13) % 40; 
    return n === 0 ? 'bg-white/5' : n < 6 ? 'bg-cyan/20' : n < 14 ? 'bg-cyan/40' : n < 24 ? 'bg-cyan/70' : 'bg-[#67e8f9] shadow-[0_0_8px_#67e8f9]';
  }

  getCircumference(): number {
    return 2 * Math.PI * 42;
  }
  
  getDashOffset(score: number): number {
    return this.getCircumference() * (1 - score / 100);
  }

  ngOnInit(): void {
    this.api.get<Candidate[]>('/candidates').subscribe({
      next: d => { this.candidates = d; this.loading = false; },
      error: () => this.loading = false
    });
  }

  removeWidget(id: string): void { this.widgets.delete(id); }
  addWidget(id: string): void { this.widgets.add(id); this.toast.show(`${id.toUpperCase()} widget added`, 'ok'); }
  addAll(): void { ['gauge', 'heatmap', 'graph', 'feed'].forEach(x => this.widgets.add(x)); }
}
