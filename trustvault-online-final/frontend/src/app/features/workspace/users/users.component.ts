import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { User, UserRole } from '../../../core/models/api.models';
import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'tv-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  private readonly api = inject(ApiService); 
  private readonly fb = inject(FormBuilder); 
  private readonly toast = inject(ToastService);

  users: User[] = [];
  loading = true;
  showReg = false;
  checkingId = false;
  idAvailable = false;
  private checkTimer: any;

  form = this.fb.group({
    userId: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]{3,20}$/)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    role: ['General User', Validators.required],
    accessLevel: ['Beta (Internal)', Validators.required]
  });

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.users = [
        { id: 'admin', name: 'Alex Admin', role: 'Admin', accessLevel: 'Omega (Full)', status: 'Active' },
        { id: 'priya', name: 'Priya Sharma', role: 'General User', accessLevel: 'Beta (Internal)', status: 'Active' }
      ];
      this.loading = false;
    }, 1000);
  }

  toggleReg(): void {
    this.showReg = !this.showReg;
    this.form.reset({ role: 'General User', accessLevel: 'Beta (Internal)' });
    this.idAvailable = false;
    this.checkingId = false;
  }

  onIdInput(): void {
    const id = this.form.get('userId')?.value;
    clearTimeout(this.checkTimer);
    this.idAvailable = false;
    
    if (!id || this.form.get('userId')?.invalid) {
      this.checkingId = false;
      return;
    }

    this.checkingId = true;
    this.checkTimer = setTimeout(() => {
      // Mock validation: check if ID exists
      const exists = this.users.some(u => u.id.toLowerCase() === id.toLowerCase());
      this.idAvailable = !exists;
      this.checkingId = false;
    }, 450);
  }

  submit(): void {
    if (this.form.invalid || !this.idAvailable) return;
    
    const val = this.form.value;
    const newUser: User = {
      id: val.userId!,
      name: val.name!,
      role: val.role! as UserRole,
      accessLevel: val.accessLevel!,
      status: 'Active'
    };

    this.form.disable();
    setTimeout(() => {
      this.users.push(newUser);
      this.toast.show(`Operator ${newUser.id} created`, 'ok');
      this.toggleReg();
      this.form.enable();
    }, 700);
  }

  toggleStatus(user: User): void {
    this.loading = true;
    setTimeout(() => {
      user.status = user.status === 'Active' ? 'Suspended' : 'Active';
      this.loading = false;
    }, 800);
  }
}
