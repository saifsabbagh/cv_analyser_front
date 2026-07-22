// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// export const roleGuard = (requiredRole: string): CanActivateFn => {
//   return (route, state) => {
//     const authService = inject(AuthService);
//     const router = inject(Router);
//     const role = authService.getUserRole();
//     if (role === requiredRole) return true;
//     router.navigate(['/login']);
//     return false;
//   };
// };
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const roleGuard = (requiredRole: string): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Si user déjà chargé en mémoire → check direct
    const currentUser = authService.currentUser$.value;
    if (currentUser) {
      if (currentUser.role === requiredRole) return true;
      router.navigate(['/login']);
      return false;
    }

    // Sinon (refresh / URL directe) → si token existe, on charge le user avant de décider
    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    return authService.getMe().pipe(
      map(user => {
        if (user.role === requiredRole) return true;
        router.navigate(['/login']);
        return false;
      }),
      catchError(() => {
        router.navigate(['/login']);
        return of(false);
      })
    );
  };
};