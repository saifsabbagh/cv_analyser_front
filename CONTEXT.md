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
│   ├── styles/
│   │   └── _tokens.scss            ← design tokens (couleurs, dark/light)
│   └── app/
│       ├── app.routes.ts           ← routing global
│       ├── app.config.ts           ← provideHttpClient, interceptors
│       ├── core/
│       │   ├── models/
│       │   │   └── user.model.ts
│       │   ├── services/
│       │   │   ├── auth.service.ts
│       │   │   ├── token.service.ts
│       │   │   └── theme.service.ts
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
│               ├── loader/
│               └── theme-toggle/
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

### theme.service.ts
```typescript
import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'app-theme';
  theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const value = this.theme();
      document.documentElement.setAttribute('data-theme', value);
      localStorage.setItem(this.STORAGE_KEY, value);
    });
  }

  private getInitialTheme(): Theme {
    const saved = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  toggle() {
    this.theme.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(value: Theme) {
    this.theme.set(value);
  }
}
```
Toggle UI : `src/app/shared/components/theme-toggle/theme-toggle.component.ts` (standalone, injecte ThemeService, bouton icône ☀️/🌙), placé dans navbar publique + sidebar candidate + sidebar admin.

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

### Thème (Dark/Light — toggle global, PLUS de thème fixe par espace)
Le thème n'est plus lié à l'espace (public/auth/candidate/admin) mais à la préférence utilisateur, appliquée partout via `[data-theme]` sur `<html>`.
- Par défaut : **dark** (ou préférence système `prefers-color-scheme` si détectée)
- Persisté dans `localStorage` (clé `app-theme`)
- Géré par `ThemeService` (voir Core Services ci-dessus)
- Toggle visible dans navbar publique, sidebar candidate, sidebar admin

### Design Tokens (SCSS variables + CSS custom properties)
Fichier source : `src/styles/_tokens.scss`, importé dans `styles.scss` racine.
**Toute couleur du projet DOIT passer par ces tokens.** Aucune valeur hex en dur dans un composant (ni `bg-[#xxxxxx]` Tailwind arbitrary, ni SCSS inline).

```scss
:root {
  // Light mode
  --color-bg: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-surface-alt: #F1F5F9;
  --color-primary: #1B2A4A;
  --color-primary-hover: #24365F;
  --color-accent: #2F9E5B;
  --color-accent-hover: #278A4E;
  --color-text: #0F172A;
  --color-text-secondary: #475569;
  --color-border: #E2E8F0;
  --color-error: #DC2626;
  --color-success: #16A34A;
  --color-warning: #D97706;
}

[data-theme="dark"] {
  --color-bg: #0F172A;
  --color-surface: #1E293B;
  --color-surface-alt: #273449;
  --color-primary: #4C6FE0;
  --color-primary-hover: #3D5BC7;
  --color-accent: #3AC17A;
  --color-accent-hover: #2FA867;
  --color-text: #F1F5F9;
  --color-text-secondary: #94A3B8;
  --color-border: #334155;
  --color-error: #F87171;
  --color-success: #4ADE80;
  --color-warning: #FBBF24;
}
```

### Tailwind config — mapping des tokens
`tailwind.config.js` référence les CSS variables, jamais de hex en dur :
```javascript
theme: {
  extend: {
    colors: {
      bg: 'var(--color-bg)',
      surface: 'var(--color-surface)',
      'surface-alt': 'var(--color-surface-alt)',
      primary: { DEFAULT: 'var(--color-primary)', hover: 'var(--color-primary-hover)' },
      accent: { DEFAULT: 'var(--color-accent)', hover: 'var(--color-accent-hover)' },
      text: { DEFAULT: 'var(--color-text)', secondary: 'var(--color-text-secondary)' },
      border: 'var(--color-border)',
      error: 'var(--color-error)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
    }
  }
}
```
Usage dans les components : `bg-surface`, `text-text-secondary`, `border-border`, `bg-primary hover:bg-primary-hover`, etc. — jamais `bg-[#1E293B]`.

### Règle couleur des scores (GLOBALE, partout)
```typescript
getScoreColor(score: number): string {
  if (score >= 0.7) return 'var(--color-success)';
  if (score >= 0.4) return 'var(--color-warning)';
  return 'var(--color-error)';
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

### Effets SCSS réutilisables (basés sur tokens, pas de hex en dur)
```scss
// Dot pattern background
.dark-bg-pattern {
  background-color: var(--color-bg);
  background-image: radial-gradient(var(--color-border) 1px, transparent 1px);
  background-size: 20px 20px;
}

// Glow sur cards
.card-glow {
  box-shadow: 0 0 30px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

// Glow décoratif coin (pages auth)
.glow-decoration {
  position: fixed;
  bottom: -200px;
  left: -200px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, color-mix(in srgb, var(--color-primary) 15%, transparent), transparent 70%);
  pointer-events: none;
}

// Gradient bouton primary
.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  &:hover { background: linear-gradient(135deg, var(--color-primary-hover), var(--color-accent-hover)); }
}
```

### RÈGLE — DevExtreme vs Custom (Tailwind/SCSS)

**Utiliser DevExtreme UNIQUEMENT pour :**
- `dx-data-grid` → tables complexes (Admin : users, jobs, skills, matches) avec sorting/filtering/pagination
- `dx-chart` / `dx-pie-chart` / `dx-circular-gauge` → graphiques et score circle (matching results, admin dashboard)
- `dx-tag-box` → multi-select (skills sur CV upload, création de job côté admin)
- `dx-popup` → modals (confirmation delete, formulaires d'édition admin)
- `dx-toast` → notifications succès/erreur

**Ne JAMAIS utiliser DevExtreme pour :**
- Auth pages (login, register, forgot-password, reset-password) → 100% custom Tailwind/SCSS
- Pages publiques (landing, jobs listing) → 100% custom Tailwind/SCSS
- Inputs, boutons, checkboxes, labels standards → toujours custom, via les tokens (`bg-surface`, `border-border`, etc.)
- Loading indicators simples → spinner CSS custom (sauf déjà dans un contexte dx-* comme un dx-data-grid, où `dx-load-indicator` natif est acceptable)

**Composants DevExtreme — doivent aussi respecter le thème actif** (override SCSS global lisant les CSS variables, jamais de valeurs fixes) :
```scss
.dx-texteditor.dx-editor-outlined { border-color: var(--color-border); background: var(--color-bg); }
.dx-texteditor-input { color: var(--color-text); }
.dx-datagrid { background-color: var(--color-surface); color: var(--color-text); }
```

**Raison** : DevExtreme impose un override compliqué sur les inputs/boutons/cards custom, difficile à faire matcher pixel-perfect. Réservé aux composants complexes où il apporte une vraie valeur (grids, charts, gauges, tag-box, popup, toast).

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
- [ ] Aucune couleur hex en dur — tout passe par les tokens (`bg-surface`, `text-text`, `var(--color-*)`)
- [ ] AGENT_WORK_LOG.md mis à jour (🔲 → ✅)