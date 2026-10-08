import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private readonly offlineSubject = new BehaviorSubject<boolean>(false);
  readonly offline$ = this.offlineSubject.asObservable();

  setOffline(value: boolean): void {
    this.offlineSubject.next(value);
  }

  toggleOffline(): void {
    this.setOffline(!this.offlineSubject.value);
  }

  get isOffline(): boolean {
    return this.offlineSubject.value;
  }
}
