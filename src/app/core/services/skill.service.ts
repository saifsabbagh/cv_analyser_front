import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Skill, SkillFilters, SkillListResponse } from '../models/skill.model';

@Injectable({ providedIn: 'root' })
export class SkillService {
  private http = inject(HttpClient);
  private readonly BASE_URL = environment.apiUrl;

  getAll(filters: SkillFilters = {}): Observable<SkillListResponse> {
    let httpParams = new HttpParams();
    if (filters.search !== undefined) httpParams = httpParams.set('search', filters.search);
    if (filters.page !== undefined) httpParams = httpParams.set('page', filters.page);
    if (filters.limit !== undefined) httpParams = httpParams.set('limit', filters.limit);
    if (filters.sortBy !== undefined) httpParams = httpParams.set('sortBy', filters.sortBy);
    if (filters.order !== undefined) httpParams = httpParams.set('order', filters.order);

    return this.http.get<any>(`${this.BASE_URL}/skills`, { params: httpParams }).pipe(
      map(res => res.data as SkillListResponse),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors du chargement des compétences';
        return throwError(() => new Error(message));
      })
    );
  }

  create(name: string): Observable<Skill> {
    return this.http.post<any>(`${this.BASE_URL}/skills`, { name }).pipe(
      map(res => res.data as Skill),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors de la création de la compétence';
        return throwError(() => new Error(message));
      })
    );
  }

  update(id: number, name: string): Observable<Skill> {
    return this.http.put<any>(`${this.BASE_URL}/skills/${id}`, { name }).pipe(
      map(res => res.data as Skill),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors de la modification de la compétence';
        return throwError(() => new Error(message));
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<any>(`${this.BASE_URL}/skills/${id}`).pipe(
      map(() => undefined),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors de la suppression de la compétence';
        return throwError(() => new Error(message));
      })
    );
  }
}
