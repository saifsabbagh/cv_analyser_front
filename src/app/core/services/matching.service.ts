import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
        throw new Error(message);
      })
    );
  }

  launchMatching(cvId: number, jobId: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/match`, { cvId, jobId }).pipe(
      map(res => res.data),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors du lancement du matching';
        throw new Error(message);
      })
    );
  }
}
