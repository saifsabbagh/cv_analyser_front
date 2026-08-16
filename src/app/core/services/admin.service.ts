import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  AdminUser,
  UserFilters,
  PaginatedUsers,
  DashboardStats,
  MatchFilters,
  PaginatedMatches,
  TopCandidate,
  AdminMatchResult
} from '../models/admin.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private readonly BASE_URL = `${environment.apiUrl}/admin`;

  getUsers(filters: UserFilters): Observable<PaginatedUsers> {
    let httpParams = new HttpParams();
    if (filters.search !== undefined) httpParams = httpParams.set('search', filters.search);
    if (filters.role !== undefined) httpParams = httpParams.set('role', filters.role);
    if (filters.isActive !== undefined) httpParams = httpParams.set('isActive', filters.isActive);
    if (filters.page !== undefined) httpParams = httpParams.set('page', filters.page);
    if (filters.limit !== undefined) httpParams = httpParams.set('limit', filters.limit);
    if (filters.sortBy !== undefined) httpParams = httpParams.set('sortBy', filters.sortBy);
    if (filters.order !== undefined) httpParams = httpParams.set('order', filters.order);

    return this.http.get<any>(`${this.BASE_URL}/users`, { params: httpParams }).pipe(
      map(res => res.data as PaginatedUsers),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors du chargement des utilisateurs';
        return throwError(() => new Error(message));
      })
    );
  }

  toggleUserActive(id: number): Observable<AdminUser> {
    return this.http.patch<any>(`${this.BASE_URL}/users/${id}/toggle-active`, {}).pipe(
      map(res => res.data as AdminUser),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors du changement de statut';
        return throwError(() => new Error(message));
      })
    );
  }

  changeUserRole(id: number, role: 'ADMIN' | 'CANDIDATE'): Observable<AdminUser> {
    return this.http.patch<any>(`${this.BASE_URL}/users/${id}/role`, { role }).pipe(
      map(res => res.data as AdminUser),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors du changement de rôle';
        return throwError(() => new Error(message));
      })
    );
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<any>(`${this.BASE_URL}/stats`).pipe(
      map(res => res.data as DashboardStats),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors du chargement des statistiques';
        return throwError(() => new Error(message));
      })
    );
  }

  getAllMatches(filters: MatchFilters): Observable<PaginatedMatches> {
    let httpParams = new HttpParams();
    if (filters.jobId !== undefined) httpParams = httpParams.set('jobId', filters.jobId);
    if (filters.minScore !== undefined) httpParams = httpParams.set('minScore', filters.minScore);
    if (filters.maxScore !== undefined) httpParams = httpParams.set('maxScore', filters.maxScore);
    if (filters.archived !== undefined) httpParams = httpParams.set('archived', filters.archived);
    if (filters.page !== undefined) httpParams = httpParams.set('page', filters.page);
    if (filters.limit !== undefined) httpParams = httpParams.set('limit', filters.limit);

    return this.http.get<any>(`${this.BASE_URL}/matches`, { params: httpParams }).pipe(
      map(res => res.data as PaginatedMatches),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors du chargement des matchings';
        return throwError(() => new Error(message));
      })
    );
  }

  getTopCandidates(jobId: number, limit?: number): Observable<TopCandidate[]> {
    let httpParams = new HttpParams();
    if (limit !== undefined) httpParams = httpParams.set('limit', limit);

    return this.http.get<any>(`${this.BASE_URL}/match/job/${jobId}/top`, { params: httpParams }).pipe(
      map(res => res.data as TopCandidate[]),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors du chargement des meilleurs candidats';
        return throwError(() => new Error(message));
      })
    );
  }

  toggleMatchArchived(id: number): Observable<AdminMatchResult> {
    return this.http.patch<any>(`${this.BASE_URL}/matches/${id}/toggle-archived`, {}).pipe(
      map(res => res.data as AdminMatchResult),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors de la modification du statut d\'archivage';
        return throwError(() => new Error(message));
      })
    );
  }
}
