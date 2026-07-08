# CV Analyzer — Frontend Angular Context

> Fichier de référence pour tous les agents travaillant sur ce projet.
> Lire ENTIÈREMENT avant de créer ou modifier un fichier.

---

## Stack Technique
- **Framework** : Angular 17+ (standalone components, ZERO NgModules)
- **UI Library** : DevExtreme (dx-text-box, dx-button, dx-data-grid, etc.)
- **CSS** : Tailwind CSS + SCSS (les deux ensemble)
- **Forms** : Reactive Forms UNIQUEMENT (pas template-driven)
- **HTTP** : HttpClient avec intercepteurs fonctionnels
- **State** : Signals Angular ou BehaviorSubject (pas NgRx)
- **Routing** : app.routes.ts avec lazy loading

---

## Backend API
- **Base URL** : `http://localhost:4000/api`
- **Auth** : JWT — accessToken (15min) + refreshToken (7j)
- **Réponse standard** : `{ success: boolean, message: string, data: any }`
- **Roles** : `'CANDIDATE'` | `'ADMIN'`

---

## Endpoints Backend

### Auth
| Method | Route | Body/Params | Description |
|--------|-------|-------------|-------------|
| POST | /auth/register | { name, email, password } | Inscription |
| POST | /auth/login | { email, password } | → { accessToken, refreshToken, user } |
| POST | /auth/logout | Header Bearer | Déconnexion |
| POST | /auth/refresh | { refreshToken } | Renouvellement token |
| POST | /auth/forgot-password | { email } | Reset password |
| POST | /auth/reset-password | { token, newPassword } | Nouveau password |
| GET | /auth/me | Header Bearer | Profil connecté |

### Skills
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /skills | authMiddleware | Liste + search + pagination |
| GET | /skills/:id | authMiddleware | Détail skill |
| POST | /skills | ADMIN | Créer skill { name } |
| PUT | /skills/:id | ADMIN | Modifier skill { name } |
| DELETE | /skills/:id | ADMIN | Supprimer skill |
| POST | /skills/bulk | ADMIN | { names: string[] } |

### Jobs
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /jobs | authMiddleware | { search?, location?, page?, limit? } |
| GET | /jobs/:id | authMiddleware | Détail offre |
| GET | /jobs/:id/skills | authMiddleware | Skills requis |
| POST | /jobs | ADMIN | Créer offre |
| PUT | /jobs/:id | ADMIN | Modifier offre |
| DELETE | /jobs/:id | ADMIN | Supprimer offre |
| PUT | /jobs/:id/skills | ADMIN | { skillNames: string[] } |

### CV
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /cv/upload | CANDIDATE | multipart/form-data, field: "cv" |
| GET | /cv | authMiddleware | Liste CVs (candidat: les siens, admin: tout) |
| GET | /cv/:id | authMiddleware | Détail CV + skills extraits |
| GET | /cv/:id/status | authMiddleware | { status: PENDING\|EXTRACTED\|FAILED, skillCount } |
| DELETE | /cv/:id | authMiddleware | Supprimer CV |

### Matching
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /match | CANDIDATE | { cvId, jobId } → calcul matching |
| GET | /match/my-results | CANDIDATE | Liste matchings du candidat |
| GET | /match/:id | authMiddleware | Détail matching |
| DELETE | /match/:id | authMiddleware | Supprimer matching |

### Admin
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /admin/stats | ADMIN | Stats globales dashboard |
| GET | /admin/users | ADMIN | { search?, role?, isActive?, page?, limit? } |
| PATCH | /admin/users/:id/toggle-active | ADMIN | Activer/désactiver user |
| PATCH | /admin/users/:id/role | ADMIN | { role } changer rôle |
| GET | /admin/jobs/:jobId/top-candidates | ADMIN | { limit? } top candidats |
| GET | /admin/matches | ADMIN | { jobId?, minScore?, maxScore?, page?, limit? } |

---

## Structure du Projet
```
cv-front/
├── src/
│   ├── environments/
│   │   └── environment.ts          ← apiUrl: 'http://localhost:4000/api'
│   └── app/
│       ├── app.routes.ts           ← routing global
│       ├── app.config.ts           ← provideHttpClient, interceptors
│       ├── core/
│       │   ├── models/
│       │   │   └── user.model.ts
│       │   ├── services/
│       │   │   ├── auth.service.ts
│       │   │   └── token.service.ts
│       │   ├── guards/
│       │   │   ├── auth.guard.ts
│       │   │   └── role.guard.ts
│       │   └── interceptors/
│       │       └── auth.interceptor.ts
│       ├── features/
│       │   ├── public/
│       │   │   ├── landing/
│       │   │   ├── jobs/
│       │   │   └── job-detail/
│       │   ├── auth/
│       │   │   ├── login/
│       │   │   ├── register/
│       │   │   ├── forgot-password/
│       │   │   └── reset-password/
│       │   ├── candidate/
│       │   │   ├── dashboard/
│       │   │   ├── cv/
│       │   │   ├── cv-detail/
│       │   │   ├── jobs/
│       │   │   ├── job-detail/
│       │   │   ├── matchings/
│       │   │   ├── matching-detail/
│       │   │   └── profile/
│       │   └── admin/
│       │       ├── dashboard/
│       │       ├── users/
│       │       ├── jobs/
│       │       ├── skills/
│       │       └── matches/
│       └── shared/
│           └── components/
│               ├── navbar/
│               ├── sidebar/
│               └── loader/
├── CONTEXT.md
└── AGENT_WORK_LOG.md
```

---

## Routing Global (app.routes.ts)
```typescript
export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'jobs', component: PublicJobsComponent },
  { path: 'jobs/:id', component: PublicJobDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'candidate',
    canActivate: [authGuard, roleGuard('CANDIDATE')],
    children: [
      { path: 'dashboard', component: CandidateDashboardComponent },
      { path: 'cv', component: CvListComponent },
      { path: 'cv/:id', component: CvDetailComponent },
      { path: 'jobs', component: CandidateJobsComponent },
      { path: 'jobs/:id', component: CandidateJobDetailComponent },
      { path: 'matchings', component: MatchingsComponent },
      { path: 'matchings/:id', component: MatchingDetailComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('ADMIN')],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'jobs', component: AdminJobsComponent },
      { path: 'skills', component: AdminSkillsComponent },
      { path: 'matches', component: AdminMatchesComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
```

---

## Core Services

### token.service.ts
```typescript
// Méthodes obligatoires :
saveTokens(accessToken: string, refreshToken: string): void
  → localStorage.setItem('accessToken', accessToken)
  → localStorage.setItem('refreshToken', refreshToken)

getAccessToken(): string | null
getRefreshToken(): string | null

clearTokens(): void
  → localStorage.removeItem('accessToken')
  → localStorage.removeItem('refreshToken')

isTokenExpired(token: string): boolean
  → decode payload via atob(token.split('.')[1])
  → comparer exp * 1000 avec Date.now()
```

### auth.service.ts
```typescript
// BehaviorSubject état global
currentUser$ = new BehaviorSubject<User | null>(null)

// Méthodes :
login(email, password) → POST /auth/login
  → tokenService.saveTokens()
  → currentUser$.next(user)
  → return user

register(name, email, password) → POST /auth/register

logout() → POST /auth/logout
  → tokenService.clearTokens()
  → currentUser$.next(null)
  → router.navigate(['/login'])

forgotPassword(email) → POST /auth/forgot-password
resetPassword(token, newPassword) → POST /auth/reset-password
getMe() → GET /auth/me

isLoggedIn(): boolean
  → !!tokenService.getAccessToken()
  && !tokenService.isTokenExpired(accessToken)

getUserRole(): 'CANDIDATE' | 'ADMIN' | null
  → currentUser$.value?.role ?? null
```

### auth.interceptor.ts (HttpInterceptorFn)
```typescript
// 1. Injecter Authorization: Bearer <accessToken> sur chaque requête
// 2. Sur réponse 401 :
//    → appeler authService.refreshToken()
//    → rejouer la requête originale avec nouveau token
//    → si refresh échoue → authService.logout()
```

### Modèle User
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'CANDIDATE' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
```

---

## Design System

### Thème par espace
| Espace | Mode | Background | Sidebar | Cards |
|--------|------|------------|---------|-------|
| Pages publiques | Dark | #0F172A | — | #1E293B |
| Auth (login/register) | Dark | #0F172A | — | #1E293B |
| Candidate space | Dark | #0F172A | #1E293B | #1E293B |
| Admin space | Light | #F8FAFC | #FFFFFF | #FFFFFF |

### Couleurs
```scss
// Dark mode
--bg-primary: #0F172A;
--bg-card: #1E293B;
--bg-hover: #334155;
--border: #334155;
--text-primary: #F8FAFC;
--text-secondary: #94A3B8;

// Brand colors (dark + light)
--color-indigo: #6366F1;
--color-indigo-hover: #4F46E5;
--color-indigo-light: rgba(99, 102, 241, 0.15);
--color-violet: #8B5CF6;

// Semantic
--color-success: #10B981;   // emerald — score >= 70%
--color-warning: #F59E0B;   // amber   — score 40-69%
--color-danger: #EF4444;    // red     — score < 40%

// Light mode (admin)
--bg-primary-light: #F8FAFC;
--bg-card-light: #FFFFFF;
--border-light: #E2E8F0;
--text-primary-light: #1E293B;
--text-secondary-light: #64748B;
```

### Règle couleur des scores (GLOBALE, partout)
```typescript
getScoreColor(score: number): string {
  if (score >= 0.7) return '#10B981';  // vert
  if (score >= 0.4) return '#F59E0B';  // orange
  return '#EF4444';                     // rouge
}

getScoreBadgeClass(score: number): string {
  if (score >= 0.7) return 'badge-success';
  if (score >= 0.4) return 'badge-warning';
  return 'badge-danger';
}
```

### Typographie
- Font : Inter (Google Fonts)
- `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap')`
- body : font-family: 'Inter', sans-serif

### Effets SCSS réutilisables
```scss
// Dot pattern background (pages dark)
.dark-bg-pattern {
  background-color: #0F172A;
  background-image: radial-gradient(#334155 1px, transparent 1px);
  background-size: 20px 20px;
}

// Glow indigo sur cards
.card-glow {
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.15);
}

// Glow décoratif coin (pages auth)
.glow-decoration {
  position: fixed;
  bottom: -200px;
  left: -200px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%);
  pointer-events: none;
}

// Gradient bouton primary
.btn-primary {
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  &:hover { background: linear-gradient(135deg, #4F46E5, #7C3AED); }
}
```

### Composants DevExtreme — Configuration standard
```typescript
// dx-text-box
stylingMode: 'outlined'
// Override couleurs dans SCSS global pour dark mode :
// .dx-texteditor.dx-editor-outlined { border-color: #334155; background: #0F172A; }
// .dx-texteditor-input { color: #F8FAFC; }

// dx-button
type: 'default' (primary indigo custom) | 'normal' (outlined) | 'danger'
stylingMode: 'contained' | 'outlined' | 'text'

// dx-data-grid (admin light mode)
showBorders: false
rowAlternationEnabled: true
columnAutoWidth: true
columnHidingEnabled: true  // responsive — cache colonnes sur mobile

// dx-popup
width: '90%' (mobile) | '500px' (desktop)
height: 'auto'
showCloseButton: true

// dx-toast
displayTime: 3000
position: { at: 'top right', my: 'top right', offset: '-20 20' }
```

---

## Responsive Design (OBLIGATOIRE sur toutes les pages)

### Breakpoints Tailwind
| Préfixe | Largeur | Appareil |
|---------|---------|----------|
| (base) | < 640px | Mobile (iPhone SE = 375px) |
| sm: | ≥ 640px | Mobile large |
| md: | ≥ 768px | Tablet |
| lg: | ≥ 1024px | Desktop |
| xl: | ≥ 1280px | Desktop large |

### Approche : Mobile-first
- Styles de base = mobile (375px)
- Agrandir avec md: et lg:
- Jamais d'overflow horizontal

### Règles par composant

**Navbar publique**
- Desktop (lg:) : logo left + liens center + boutons right, horizontal
- Mobile : logo left + bouton hamburger right
  → menu déroulant full width avec liens en colonne
  → toggle via boolean `menuOpen`

**Sidebar candidate/admin**
- Desktop (lg:) : visible fixe gauche, 240px, contenu à droite avec margin-left: 240px
- Tablet/Mobile : cachée par défaut
  → bouton hamburger dans topbar → slide-in overlay sidebar
  → overlay sombre derrière, click ferme la sidebar
  → `sidebarOpen` boolean

**Grids**
```
grid-cols-1 md:grid-cols-2 lg:grid-cols-3   ← jobs, skills, features
grid-cols-1 md:grid-cols-2 lg:grid-cols-4   ← KPI cards dashboard
grid-cols-1 lg:grid-cols-2                  ← matched/missing skills (matching detail)
```

**Hero Landing**
- Desktop : flex-row (60% text / 40% mockup card)
- Mobile : flex-col (text puis mockup, mockup peut être réduit)

**Steps "Comment ça marche"**
- Desktop : horizontal avec ligne connectrice
- Mobile : vertical, numéros à gauche, texte à droite

**Tables (dx-data-grid)**
- Desktop : toutes colonnes visibles
- Mobile : `columnHidingEnabled: true` — colonnes moins importantes cachées
- Toujours wrapper dans `overflow-x-auto`

**Pages Auth (login/register/forgot)**
- Card : `w-full max-w-[420px] mx-4 sm:mx-auto`
- Padding card : `p-6 sm:p-10`

**Matching Result**
- Desktop : 2 colonnes (matched left / missing right)
- Mobile : 1 colonne (matched puis missing)

### Pattern sidebar responsive (réutilisable)
```typescript
// Dans chaque layout component candidate/admin
sidebarOpen = false;
toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }
closeSidebar() { this.sidebarOpen = false; }
```
```html
<!-- Overlay mobile -->
<div *ngIf="sidebarOpen" 
     class="fixed inset-0 bg-black/50 z-20 lg:hidden"
     (click)="closeSidebar()">
</div>
<!-- Sidebar -->
<aside [class.translate-x-0]="sidebarOpen"
       [class.-translate-x-full]="!sidebarOpen"
       class="fixed left-0 top-0 h-full w-60 z-30 
              transition-transform lg:translate-x-0">
</aside>
```

---

## Conventions de Code

### Obligatoires
- **Standalone components UNIQUEMENT** — pas de NgModules, jamais
- `inject()` pour injecter les services (pas constructeur dans les nouveaux components)
- `HttpClient` via `provideHttpClient(withInterceptors([authInterceptor]))` dans app.config.ts
- **Tous les textes UI en FRANÇAIS**
- **Lazy loading** pour les features (candidate, admin)
- Chaque component : `.ts` + `.html` + `.scss` séparés

### Gestion des erreurs HTTP
```typescript
// Pattern standard dans les services
login(email: string, password: string): Observable<User> {
  return this.http.post<any>(`${this.baseUrl}/auth/login`, { email, password })
    .pipe(
      map(res => res.data),
      catchError(err => {
        const message = err.error?.message || 'Une erreur est survenue';
        return throwError(() => new Error(message));
      })
    );
}
```

### Loading states
```typescript
// Dans chaque component avec appel API
isLoading = false;

submit() {
  this.isLoading = true;
  this.service.call().subscribe({
    next: () => { this.isLoading = false; },
    error: (err) => { 
      this.isLoading = false;
      this.errorMessage = err.message;
    }
  });
}
```

### Validation Reactive Forms
```typescript
// Afficher erreur seulement si touched + invalid
isFieldInvalid(fieldName: string): boolean {
  const field = this.form.get(fieldName);
  return !!(field?.invalid && field?.touched);
}
```

---

## Checklist avant chaque commit
- [ ] Component est standalone (`standalone: true`)
- [ ] Textes en français
- [ ] Responsive testé mentalement sur 375px
- [ ] isLoading géré sur tous les appels API
- [ ] Erreurs backend affichées à l'utilisateur
- [ ] Route ajoutée dans app.routes.ts
- [ ] AGENT_WORK_LOG.md mis à jour (🔲 → ✅)