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
  {
    path: 'candidate',
    canActivate: [authGuard, roleGuard('CANDIDATE')],
    loadComponent: () => import('./features/candidate/layout/candidate-layout.component').then(m => m.CandidateLayoutComponent),
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/candidate/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'cv/upload', loadComponent: () => import('./features/candidate/cv/cv-upload/cv-upload.component').then(m => m.CvUploadComponent) },
      { path: 'cv', loadComponent: () => import('./features/candidate/cv/cv-list/cv-list.component').then(m => m.CvListComponent) },
      { path: 'cv/:id', loadComponent: () => import('./features/candidate/cv/cv-detail/cv-detail.component').then(m => m.CvDetailComponent) },
      { path: 'jobs', loadComponent: () => import('./features/candidate/jobs/candidate-jobs.component').then(m => m.CandidateJobsComponent) },
      { path: 'jobs/:id', loadComponent: () => import('./features/candidate/jobs/job-detail/candidate-job-detail.component').then(m => m.CandidateJobDetailComponent) },
      { path: 'matchings', loadComponent: () => import('./features/candidate/matchings/matchings.component').then(m => m.MatchingsComponent) },
      { path: 'matchings/:id', loadComponent: () => import('./features/candidate/matchings/matching-detail/matching-detail.component').then(m => m.MatchingDetailComponent) },
      { path: 'profile', loadComponent: () => import('./features/candidate/profile/profile.component').then(m => m.ProfileComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('ADMIN')],
    loadComponent: () => import('./features/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'users', loadComponent: () => import('./features/admin/users/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'jobs', loadComponent: () => import('./features/admin/jobs/admin-jobs.component').then(m => m.AdminJobsComponent) },
      { path: 'skills', loadComponent: () => import('./features/admin/skills/admin-skills.component').then(m => m.AdminSkillsComponent) },
      { path: 'matches', loadComponent: () => import('./features/admin/matches/admin-matches.component').then(m => m.AdminMatchesComponent) },
      { path: 'settings', loadComponent: () => import('./features/admin/settings/admin-settings.component').then(m => m.AdminSettingsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
