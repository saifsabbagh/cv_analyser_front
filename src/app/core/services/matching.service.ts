import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatchResult, MatchListResponse } from '../models/matching.model';

@Injectable({ providedIn: 'root' })
export class MatchingService {
  private http = inject(HttpClient);
  private readonly BASE_URL = environment.apiUrl;

  getMyResults(page = 1, limit = 50): Observable<MatchListResponse> {
    return this.http.get<any>(`${this.BASE_URL}/match/my-results`, { params: { page, limit } }).pipe(
      map(res => res.data as MatchListResponse),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors du chargement des résultats';
        return throwError(() => new Error(message));
      })
    );
  }

  launchMatching(cvId: number, jobId: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/match`, { cvId, jobId }).pipe(
      map(res => res.data),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors du lancement du matching';
        return throwError(() => new Error(message));
      })
    );
  }

  getById(id: number): Observable<MatchResult> {
    return this.http.get<any>(`${this.BASE_URL}/match/${id}`).pipe(
      map(res => res.data as MatchResult),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors du chargement du détail';
        return throwError(() => new Error(message));
      })
    );
  }

  deleteMatching(id: number): Observable<void> {
    return this.http.delete<any>(`${this.BASE_URL}/match/${id}`).pipe(
      map(() => undefined),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors de la suppression';
        return throwError(() => new Error(message));
      })
    );
  }
}
