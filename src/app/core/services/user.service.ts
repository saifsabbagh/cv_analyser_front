import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly BASE_URL = environment.apiUrl;

  updateProfile(name?: string, avatarFile?: File): Observable<User> {
    const formData = new FormData();
    if (name) formData.append('name', name);
    if (avatarFile) formData.append('avatar', avatarFile);

    return this.http.put<any>(`${this.BASE_URL}/users/me`, formData).pipe(
      map(res => res.data as User),
      tap(updatedUser => this.authService.currentUser$.next(updatedUser)),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors de la mise à jour du profil';
        return throwError(() => new Error(message));
      })
    );
  }
}
