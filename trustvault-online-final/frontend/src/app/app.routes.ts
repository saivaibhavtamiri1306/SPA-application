import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path:'', pathMatch:'full', redirectTo:'login' },
  { path:'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  {
    path:'', canActivate:[authGuard], loadComponent: () => import('./features/workspace/shell.component').then(m => m.ShellComponent),
    children:[
      { path:'dashboard', loadComponent: () => import('./features/workspace/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path:'records', loadComponent: () => import('./features/workspace/records/records.component').then(m => m.RecordsComponent) },
      { path:'users', canActivate:[adminGuard], loadComponent: () => import('./features/workspace/users/users.component').then(m => m.UsersComponent) },
      { path:'pipeline', canActivate:[adminGuard], loadComponent: () => import('./features/workspace/pipeline/pipeline.component').then(m => m.PipelineComponent) },
      { path:'audit', canActivate:[adminGuard], loadComponent: () => import('./features/workspace/audit/audit.component').then(m => m.AuditComponent) },
      { path:'profile', loadComponent: () => import('./features/workspace/profile/profile.component').then(m => m.ProfileComponent) }
    ]
  },
  { path:'**', redirectTo:'dashboard' }
];
