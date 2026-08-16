# CV Analyzer Frontend — Agent Work Log

> Suivi de tous les fichiers créés/modifiés, module par module.

---

## ✅ Setup Initial

**Statut : TERMINÉ**

- Angular 17+ standalone créé (ng new cv-front)
- Tailwind CSS configuré
- SCSS activé
- DevExtreme installé
- Structure dossiers créée
- environment.ts configuré (apiUrl: 'http://localhost:4000/api')

---

## ✅ Core Services & Guards

**Statut : TERMINÉ**

### Fichiers à créer

- ✅ `src/app/core/models/user.model.ts`
- ✅ `src/app/core/services/token.service.ts`
- ✅ `src/app/core/services/auth.service.ts`
- ✅ `src/app/core/interceptors/auth.interceptor.ts`
- ✅ `src/app/core/guards/auth.guard.ts`
- ✅ `src/app/core/guards/role.guard.ts`

---

## ✅ Pages Publiques

**Statut : TERMINÉ**

### 0. Shared Public Navbar

- ✅ `src/app/shared/components/public-navbar/public-navbar.component.ts`
- ✅ `src/app/shared/components/public-navbar/public-navbar.component.html`
- ✅ `src/app/shared/components/public-navbar/public-navbar.component.scss`

### 1. Landing Page (/)

- ✅ `src/app/features/public/landing/landing.component.ts`
- ✅ `src/app/features/public/landing/landing.component.html`
- ✅ `src/app/features/public/landing/landing.component.scss`

### 2. Public Jobs (/jobs)

- ✅ `src/app/features/public/jobs/public-jobs.component.ts`
- ✅ `src/app/features/public/jobs/public-jobs.component.html`
- ✅ `src/app/features/public/jobs/public-jobs.component.scss`

### 3. Public Job Detail (/jobs/:id)

- ✅ `src/app/features/public/job-detail/public-job-detail.component.ts`
- ✅ `src/app/features/public/job-detail/public-job-detail.component.html`
- ✅ `src/app/features/public/job-detail/public-job-detail.component.scss`

---

## ✅ Module Auth

**Statut : TERMINÉ**

### 4. Login (/login)

- ✅ `src/app/features/auth/login/login.component.ts`
- ✅ `src/app/features/auth/login/login.component.html`
- ✅ `src/app/features/auth/login/login.component.scss`

### 5. Register (/register)

- ✅ `src/app/features/auth/register/register.component.ts`
- ✅ `src/app/features/auth/register/register.component.html`
- ✅ `src/app/features/auth/register/register.component.scss`

### 6. Forgot Password (/forgot-password)

- ✅ `src/app/features/auth/forgot-password/forgot-password.component.ts`
- ✅ `src/app/features/auth/forgot-password/forgot-password.component.html`
- ✅ `src/app/features/auth/forgot-password/forgot-password.component.scss`

### 7. Reset Password (/reset-password)

- ✅ `src/app/features/auth/reset-password/reset-password.component.ts`
- ✅ `src/app/features/auth/reset-password/reset-password.component.html`
- ✅ `src/app/features/auth/reset-password/reset-password.component.scss`

---

## ✅ Phase Candidate 1/6 — Layout Shell

**Statut : TERMINÉ**

### Shared Components

- ✅ `src/app/shared/components/sidebar/sidebar.component.ts`
- ✅ `src/app/shared/components/sidebar/sidebar.component.html`
- ✅ `src/app/shared/components/sidebar/sidebar.component.scss`
- ✅ `src/app/shared/components/topbar/topbar.component.ts`
- ✅ `src/app/shared/components/topbar/topbar.component.html`
- ✅ `src/app/shared/components/topbar/topbar.component.scss`

### Candidate Layout

- ✅ `src/app/features/candidate/layout/candidate-layout.component.ts`
- ✅ `src/app/features/candidate/layout/candidate-layout.component.html`
- ✅ `src/app/features/candidate/layout/candidate-layout.component.scss`

### Routing

- ✅ `src/app/app.routes.ts` — candidate route now uses lazy-loaded CandidateLayoutComponent

---

## ✅ Phase Candidate 2/6 — Dashboard + Widgets

**Statut : TERMINÉ**

### Core Models

- ✅ `src/app/core/models/cv.model.ts`
- ✅ `src/app/core/models/job.model.ts` — ajout `JobSkill` interface
- ✅ `src/app/core/models/matching.model.ts`

### Core Services

- ✅ `src/app/core/services/cv.service.ts`
- ✅ `src/app/core/services/job.service.ts` — ajout `getJobById()`, `getJobSkills()`
- ✅ `src/app/core/services/matching.service.ts` — ajout `launchMatching()`

### Shared Utilities

- ✅ `src/app/shared/utils/date.utils.ts` — `groupByWeek()`, `categorizeScores()`

### Shared Widgets (réutilisables admin)

- ✅ `src/app/shared/components/widgets/kpi-card/kpi-card.component.ts` + .html + .scss
- ✅ `src/app/shared/components/widgets/bar-chart-widget/bar-chart-widget.component.ts` + .html + .scss
- ✅ `src/app/shared/components/widgets/donut-chart-widget/donut-chart-widget.component.ts` + .html + .scss
- ✅ `src/app/shared/components/widgets/data-table-widget/data-table-widget.component.ts` + .html + .scss

### Candidate Dashboard

- ✅ `src/app/features/candidate/dashboard/dashboard.component.ts` + .html + .scss

### Routing

- ✅ `src/app/app.routes.ts` — dashboard lazy-loaded route enabled

---

## ✅ Phase Candidate 3/6 — Module CV (Liste + Upload + Détail + Aperçu PDF)

**Statut : TERMINÉ**

### Core Models

- ✅ `src/app/core/models/cv.model.ts` — ajout interfaces `Skill`, `CVDetail`

### Core Services

- ✅ `src/app/core/services/cv.service.ts` — ajout `getById()`, `upload()`, `delete()`, `getFile()`

### Shared Utilities

- ✅ `src/app/shared/utils/cv.utils.ts` — `getStatusLabel()`, `getStatusBadgeClass()`, `getStatusColor()`

### Components

- ✅ `src/app/features/candidate/cv/components/cv-card/cv-card.component.ts` + .html + .scss

### Pages

- ✅ `src/app/features/candidate/cv/cv-list/cv-list.component.ts` + .html + .scss
- ✅ `src/app/features/candidate/cv/cv-upload/cv-upload.component.ts` + .html + .scss
- ✅ `src/app/features/candidate/cv/cv-detail/cv-detail.component.ts` + .html + .scss — avec onglets Compétences / Aperçu PDF

### Backend — Nouvel endpoint PDF

- ✅ `src/services/cv.service.js` — ajout `getCVFileById()`
- ✅ `src/controllers/cv.controller.js` — ajout `getFile()`
- ✅ `src/routes/cv.routes.js` — ajout route `GET /api/cv/:id/file`

### Routing

- ✅ `src/app/app.routes.ts` — routes `cv`, `cv/upload`, `cv/:id` ajoutées

---

## ✅ Phase Candidate 4/6 — Jobs (Liste + Détail + Matching)

**Statut : TERMINÉ**

### Core Models

- ✅ `src/app/core/models/job.model.ts` — ajout interface `JobSkill`

### Core Services

- ✅ `src/app/core/services/job.service.ts` — ajout `getJobById()`, `getJobSkills()`
- ✅ `src/app/core/services/matching.service.ts` — ajout `launchMatching()`

### Components

- ✅ `src/app/features/candidate/jobs/candidate-jobs.component.ts` + .html + .scss
- ✅ `src/app/features/candidate/jobs/job-detail/candidate-job-detail.component.ts` + .html + .scss

### Routing

- ✅ `src/app/app.routes.ts` — routes `jobs`, `jobs/:id` ajoutées

---

## ✅ Module Candidate

**Statut : TERMINÉ**

### 11. Liste Offres Candidate (/candidate/jobs)

✅ candidate-jobs.component.ts / .html / .scss

### 12. Offre Detail Candidate (/candidate/jobs/:id)

✅ candidate-job-detail.component.ts / .html / .scss

### 13. Historique Matchings (/candidate/matchings)

✅ `src/app/features/candidate/matchings/matchings.component.ts`
✅ `src/app/features/candidate/matchings/matchings.component.html`
✅ `src/app/features/candidate/matchings/matchings.component.scss`

### 14. Matching Detail (/candidate/matchings/:id)

✅ `src/app/features/candidate/matchings/matching-detail/matching-detail.component.ts`
✅ `src/app/features/candidate/matchings/matching-detail/matching-detail.component.html`
✅ `src/app/features/candidate/matchings/matching-detail/matching-detail.component.scss`

### 15. Profil (/candidate/profile)

✅ `src/app/features/candidate/profile/profile.component.ts`
✅ `src/app/features/candidate/profile/profile.component.html`
✅ `src/app/features/candidate/profile/profile.component.scss`

### Companion Changes (Phase 5)

- ✅ `src/app/core/services/matching.service.ts` — ajout `getById()`, `deleteMatching()`
- ✅ `src/app/app.routes.ts` — routes `matchings`, `matchings/:id` ajoutées
- ✅ `src/styles.scss` — ajout classes `.badge-success`, `.badge-warning`, `.badge-danger`

### Companion Changes (Phase 6)

- ✅ `src/app/app.routes.ts` — route `profile` ajoutée

### Companion Changes (Phase 6 — Édition Profil)

- ✅ `src/app/core/models/user.model.ts` — ajout `avatarUrl`
- ✅ `src/app/core/services/user.service.ts` — CRÉÉ: `updateProfile()`
- ✅ `src/app/features/candidate/profile/profile.component.ts` — edition nom + avatar
- ✅ `src/app/features/candidate/profile/profile.component.html` — template éditable
- ✅ `src/app/shared/components/topbar/topbar.component.html` — affichage avatarUrl

### 🚀 Amélioration UX — Upload CV inline + Matching automatique (Phase 6.5)

- ✅ `src/app/core/services/cv.service.ts` — ajout `getStatus()`
- ✅ `src/app/features/candidate/jobs/job-detail/candidate-job-detail.component.ts` — conversion signaux (suppression ChangeDetectorRef) + upload inline avec polling + matching automatique
- ✅ `src/app/features/candidate/jobs/job-detail/candidate-job-detail.component.html` — nouveau popup multi-états : liste CVs, upload inline, polling PENDING/EXTRACTED/FAILED, auto-matching

---

## 🔲 Module Admin

**Statut : EN COURS (Dashboard + Utilisateurs terminés)**

### Core Models

- ✅ `src/app/core/models/admin.model.ts` — `AdminUser`, `UserFilters`, `PaginatedUsers`, `DashboardStats`

### Core Services

- ✅ `src/app/core/services/admin.service.ts` — `getUsers()`, `toggleUserActive()`, `changeUserRole()`, `getDashboardStats()`

### Admin Layout Shell

- ✅ `src/app/features/admin/layout/admin-layout.component.ts` + .html + .scss

### Companion Changes (Layout)

- ✅ `src/app/shared/components/sidebar/sidebar.component.ts` — input `menuItems` câblé + `homeRoute`, `settingsRoute`, `cta` (defaults candidate inchangés)
- ✅ `src/app/shared/components/sidebar/sidebar.component.html` — rendu via `items()`, icônes `users` / `skills` ajoutées
- ✅ `src/app/app.routes.ts` — bloc `admin` via AdminLayoutComponent, enfants lazy-loadés

### 16. Admin Dashboard (/admin/dashboard)

- ✅ `src/app/features/admin/dashboard/admin-dashboard.component.ts` + .html + .scss
- ✅ `src/app/features/admin/dashboard/components/account-status-panel/` .ts + .html + .scss
- ✅ `src/app/features/admin/dashboard/components/recent-activity-panel/` .ts + .html + .scss — shell, aucun endpoint backend

### 17. Gestion Utilisateurs (/admin/users)

- ✅ `src/app/features/admin/users/admin-users.component.ts` + .html + .scss
- ✅ `src/app/features/admin/users/components/user-filters/` .ts + .html + .scss
- ✅ `src/app/features/admin/users/components/user-stats-cards/` .ts + .html + .scss
- ✅ `src/app/features/admin/users/components/users-table/` .ts + .html + .scss — dx-data-grid, pagination serveur

### 18. Gestion Offres (/admin/jobs)

🔲 Placeholder standalone uniquement

### 19. Gestion Skills (/admin/skills)

🔲 Placeholder standalone uniquement

### 20. Supervision Matchings (/admin/matches)

✅ `src/app/features/admin/matches/admin-matches.component.ts` + .html + .scss — container : filtres + stats + top-candidates + table, pagination serveur, archive toggle (retrait local + toast)
✅ `src/app/features/admin/matches/components/match-filters/` .ts + .html + .scss — offre (JobService), scores min/max 0-100, recherche candidat, statut Actifs/Archivés
✅ `src/app/features/admin/matches/components/match-stats-cards/` .ts + .html + .scss — Matchings Totaux + Score Moyen (getDashboardStats)
✅ `src/app/features/admin/matches/components/matches-table/` .ts + .html + .scss — dx-data-grid, jauge + badge score, chips compétences manquantes, actions Voir Profil + archive/désarchive
✅ `src/app/features/admin/matches/components/top-candidates-panel/` .ts + .html + .scss — podium top 3 (getTopCandidates) si job sélectionné

Companion Changes (PROMPT 6bis + 7 + 10) :
- ✅ `src/app/core/models/admin.model.ts` — `archived` (AdminMatchResult), `archived?` + `search?` (MatchFilters), `recommendations` (TopCandidate), `avatarUrl?` (match.user)
- ✅ `src/app/core/services/admin.service.ts` — ajout `toggleMatchArchived()`, passage de `archived` dans `getAllMatches()`

### 21. Paramètres (/admin/settings)

🔲 Placeholder standalone uniquement

---

## Notes techniques

- Standalone components UNIQUEMENT
- Tailwind pour layout, SCSS pour effets custom
- DevExtreme pour tous les composants UI interactifs
- Textes en français
- Score >= 70% → vert, 40-69% → orange, < 40% → rouge
- Thème dark/light → toggle global géré par ThemeService (localStorage + préférence système), s'applique à TOUS les espaces (public, auth, candidate, admin) — plus de thème fixe par espace
- Toutes les couleurs passent par les design tokens (`src/styles/_tokens.scss` + mapping Tailwind) — aucune couleur hex en dur dans un composant
