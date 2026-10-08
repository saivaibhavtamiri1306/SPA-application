import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth-shell.component').then(m => m.AuthShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
      { path: 'mfa', loadComponent: () => import('./features/auth/mfa.component').then(m => m.MfaComponent) },
      { path: 'scan', loadComponent: () => import('./features/auth/scan.component').then(m => m.ScanComponent) }
    ]
  },
  {
    path: 'workspace',
    canActivate: [authGuard],
    loadComponent: () => import('./features/workspace/workspace.component').then(m => m.WorkspaceComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./features/workspace/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'records', loadComponent: () => import('./features/workspace/records/records.component').then(m => m.RecordsComponent) },
      { path: 'users', canActivate: [adminGuard], loadComponent: () => import('./features/workspace/users/users.component').then(m => m.UsersComponent) },
      { path: 'pipeline', canActivate: [adminGuard], loadComponent: () => import('./features/workspace/pipeline/pipeline.component').then(m => m.PipelineComponent) },
      { path: 'audit', canActivate: [adminGuard], loadComponent: () => import('./features/workspace/audit/audit.component').then(m => m.AuditComponent) }
    ]
  },
  { path: '**', redirectTo: 'auth/login' }
];
