import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './shared/toast.service';
import { NgFor } from '@angular/common';

@Component({
  selector:'tv-root', standalone:true, imports:[RouterOutlet, NgFor],
  templateUrl:'./app.component.html'
})
export class AppComponent {
  constructor(readonly toast: ToastService) {}
}
