import { Injectable, signal } from '@angular/core';

export interface Toast { id: number; message: string; kind: 'info'|'ok'|'err'|'warn'; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly items = signal<Toast[]>([]);
  private counter = 0;
  show(message: string, kind: Toast['kind']='info'): void {
    const id = ++this.counter;
    this.items.update(items => [...items, {id, message, kind}]);
    setTimeout(() => this.items.update(items => items.filter(x => x.id !== id)), 3600);
  }
}
