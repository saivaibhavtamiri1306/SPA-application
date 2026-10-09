import { Component, OnInit, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'tv-audit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit.component.html'
})
export class AuditComponent implements OnInit {
  private readonly toast = inject(ToastService);
  @ViewChild('scrollHost', { static: true }) scrollHost!: ElementRef<HTMLDivElement>;

  readonly staticLogs = [
    ['SYS_BOOT', 'SYSTEM', 'localhost', '0x8f...3a1'],
    ['AUTH_SUCCESS', 'priya', '192.168.1.104', '0xc2...9f4'],
    ['DATA_READ', 'priya', '192.168.1.104', '0x1a...b62'],
    ['AUTH_FAIL', 'UNKNOWN', '45.22.19.10', '0x5d...e01', true],
    ['FIREWALL_BLOCK', 'SYSTEM', '45.22.19.10', '0x99...a8c'],
    ['AUTH_SUCCESS', 'admin', '10.0.0.5', '0x33...f11'],
    ['POLICY_UPDATE', 'admin', '10.0.0.5', '0x7e...2b9']
  ];
  
  currentTime = new Date().toISOString().split('T')[1].slice(0, -1);
  
  events: any[] = [];
  visibleEvents: any[] = [];
  hashing = false;
  hashProgress = 0;
  hashResult = '';
  vinfo = 'Loading events...';

  // Virtual Scroll State
  private readonly rowHeight = 48;
  totalHeight = 0;
  offsetY = 0;

  ngOnInit(): void {
    this.generateLogs();
    this.updateVirtualScroll();
  }

  generateLogs(): void {
    const ev = ['AUTH_SUCCESS', 'DATA_READ', 'AUTH_FAIL', 'FIREWALL_BLOCK', 'POLICY_UPDATE', 'KEY_ROTATE', 'EXPORT_PDF', 'SESSION_END'];
    const us = ['admin', 'priya', 'SYSTEM', 'UNKNOWN', 'ananya', 'rohit'];
    const b = Date.UTC(2026, 9, 1);
    
    // Generate 10,000 logs instantly
    this.events = Array.from({ length: 10000 }, (_, i) => ({
      i,
      time: new Date(b + i * 37000).toISOString().replace('T', ' ').slice(0, 19),
      evt: ev[Math.floor(Math.random() * ev.length)],
      user: us[Math.floor(Math.random() * us.length)],
      ip: `${10 + Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${1 + Math.floor(Math.random() * 254)}`,
      hash: ''
    }));
    this.totalHeight = this.events.length * this.rowHeight;
  }

  onScroll(event: any): void {
    this.updateVirtualScroll(event.target.scrollTop);
  }

  updateVirtualScroll(scrollTop: number = 0): void {
    const start = Math.max(0, Math.floor(scrollTop / this.rowHeight) - 3);
    const end = Math.min(this.events.length, Math.ceil((scrollTop + 384) / this.rowHeight) + 3); // 384 is approx h-96
    
    this.offsetY = start * this.rowHeight;
    this.visibleEvents = this.events.slice(start, end);
    this.vinfo = `Rendering only ${end - start} of ${this.events.length.toLocaleString()} rows in the DOM`;
  }

  verifyChain(): void {
    this.hashing = true;
    this.hashProgress = 0;

    // Inline Web Worker for cryptography just like the HTML demo
    const workerCode = `
      const hex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
      onmessage = async ({ data }) => {
        const t0 = performance.now();
        const enc = new TextEncoder();
        const out = [];
        let prev = '0'.repeat(64);
        for (let i = 0; i < data.length; i++) {
          prev = hex(await crypto.subtle.digest('SHA-256', enc.encode(prev + data[i])));
          out.push(prev);
          if (i % 500 === 0) postMessage({ type: 'p', pct: Math.round((i / data.length) * 100) });
        }
        postMessage({ type: 'd', hashes: out, ms: Math.round(performance.now() - t0) });
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));

    const payload = this.events.map(l => `${l.i}|${l.time}|${l.evt}|${l.user}|${l.ip}`);

    worker.onmessage = ({ data }) => {
      if (data.type === 'p') {
        this.hashProgress = data.pct;
      } else {
        this.events = this.events.map((l, i) => ({ ...l, hash: data.hashes[i] }));
        this.updateVirtualScroll(this.scrollHost.nativeElement.scrollTop);
        this.hashResult = `✔ ${this.events.length.toLocaleString()} hashed in ${data.ms} ms (worker)`;
        this.hashing = false;
        this.toast.show(`Chain verified: ${this.events.length.toLocaleString()} entries`, 'ok');
        worker.terminate();
      }
    };

    worker.postMessage(payload);
  }
}
