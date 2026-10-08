import { Component, Injectable } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

type ToastKind = 'info' | 'ok' | 'warn' | 'err';
interface ToastItem { id: number; text: string; kind: ToastKind; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  private seed = 0;
  private readonly subject = new BehaviorSubject<ToastItem[]>([]);
  readonly items$ = this.subject.asObservable();
  show(text: string, kind: ToastKind = 'info', ms = 3800): void {
    const id = ++this.seed; this.subject.next([...this.subject.value, { id, text, kind }]);
    setTimeout(() => this.subject.next(this.subject.value.filter(x => x.id !== id)), ms);
  }
}

@Component({
  selector: 'tv-toast', standalone: true, imports: [CommonModule, AsyncPipe],
  template: `<div class="toast-stack"><div *ngFor="let item of items$ | async" class="toast" [class.ok]="item.kind==='ok'" [class.warn]="item.kind==='warn'" [class.err]="item.kind==='err'"><b>{{ item.kind==='ok' ? '✔' : item.kind==='warn' ? '⚠' : item.kind==='err' ? '✖' : 'ℹ' }}</b>{{ item.text }}</div></div>`,
 
})
export class ToastComponent {
  readonly items$ = this.toast.items$;
  constructor(private readonly toast: ToastService) {}
}
