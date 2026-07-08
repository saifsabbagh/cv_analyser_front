import { Routes } from '@angular/router';
import { LandingComponent } from './features/public/landing/landing.component';
import { PublicJobsComponent } from './features/public/jobs/public-jobs.component';
import { PublicJobDetailComponent } from './features/public/job-detail/public-job-detail.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'jobs', component: PublicJobsComponent },
  { path: 'jobs/:id', component: PublicJobDetailComponent },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: 'candidate', canActivate: [authGuard, roleGuard('CANDIDATE')],
    children: [] },
  { path: 'admin', canActivate: [authGuard, roleGuard('ADMIN')],
    children: [] },
  { path: '**', redirectTo: '' }
];
