import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Job, JobSkill, JobListResponse } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class JobService {
  private http = inject(HttpClient);
  private readonly BASE_URL = environment.apiUrl;

  getAll(params?: { search?: string; location?: string; page?: number; limit?: number }): Observable<JobListResponse> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.location) httpParams = httpParams.set('location', params.location);
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.limit) httpParams = httpParams.set('limit', params.limit);

    return this.http.get<any>(`${this.BASE_URL}/jobs`, { params: httpParams }).pipe(
      map(res => res.data as JobListResponse),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors du chargement des offres';
        throw new Error(message);
      })
    );
  }

  getJobById(id: number): Observable<Job> {
    return this.http.get<any>(`${this.BASE_URL}/jobs/${id}`).pipe(
      map(res => res.data as Job),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors du chargement de l\'offre';
        throw new Error(message);
      })
    );
  }

  getJobSkills(id: number): Observable<JobSkill[]> {
    return this.http.get<any>(`${this.BASE_URL}/jobs/${id}/skills`).pipe(
      map(res => res.data as JobSkill[]),
      catchError(err => {
        const message = err.error?.message || 'Erreur lors du chargement des compétences';
        throw new Error(message);
      })
    );
  }
}
