import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  private readonly BASE_URL = environment.apiUrl;
  currentUser$ = new BehaviorSubject<User | null>(null);

  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.BASE_URL}/auth/login`, { email, password }).pipe(
      map(res => {
        const data = res.data;
        this.tokenService.saveTokens(data.accessToken, data.refreshToken);
        this.currentUser$.next(data.user);
        return data.user;
      }),
      catchError(err => {
        return throwError(() => new Error(err.error?.message || 'Erreur de connexion'));
      })
    );
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/auth/register`, { name, email, password }).pipe(
      map(res => res.data),
      catchError(err => {
        return throwError(() => new Error(err.error?.message || 'Erreur inscription'));
      })
    );
  }

  logout(): void {
    // Fire and forget
    this.http.post(`${this.BASE_URL}/auth/logout`, {}).subscribe({
      error: () => {}
    });
    this.tokenService.clearTokens();
    this.currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<string> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }
    return this.http.post<any>(`${this.BASE_URL}/auth/refresh`, { refreshToken }).pipe(
      map(res => {
        this.tokenService.saveTokens(res.data.accessToken, res.data.refreshToken ?? refreshToken);
        return res.data.accessToken;
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/auth/forgot-password`, { email }).pipe(
      catchError(err => {
        return throwError(() => new Error(err.error?.message || 'Erreur'));
      })
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/auth/reset-password`, { token, newPassword }).pipe(
      catchError(err => {
        return throwError(() => new Error(err.error?.message || 'Erreur'));
      })
    );
  }

  getMe(): Observable<User> {
    return this.http.get<any>(`${this.BASE_URL}/auth/me`).pipe(
      map(res => {
        this.currentUser$.next(res.data.user);
        return res.data.user;
      })
    );
  }

  isLoggedIn(): boolean {
    const token = this.tokenService.getAccessToken();
    return !!token && !this.tokenService.isTokenExpired(token);
  }

  getUserRole(): 'CANDIDATE' | 'ADMIN' | null {
    return this.currentUser$.value?.role ?? null;
  }

  initUser(): void {
    if (this.isLoggedIn()) {
      this.getMe().subscribe({
        error: () => {
          this.tokenService.clearTokens();
          this.currentUser$.next(null);
        }
      });
    }
  }
}
