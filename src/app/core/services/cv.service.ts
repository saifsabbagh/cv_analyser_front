import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CV, CVDetail, CVListResponse } from '../models/cv.model';

@Injectable({ providedIn: 'root' })
export class CvService {
  private http = inject(HttpClient);
  private readonly BASE_URL = environment.apiUrl;

  getAll(page = 1, limit = 10): Observable<CVListResponse> {
    return this.http.get<any>(`${this.BASE_URL}/cv`, { params: { page, limit } }).pipe(
      map((res) => res.data as CVListResponse),
      catchError((err) => {
        const message = err.error?.message || 'Erreur lors du chargement des CVs';
        throw new Error(message);
      }),
    );
  }

  getById(id: number): Observable<CVDetail> {
    return this.http.get<any>(`${this.BASE_URL}/cv/${id}`).pipe(
      map((res) => res.data as CVDetail),
      catchError((err) => {
        const message = err.error?.message || 'Erreur lors du chargement du CV';
        throw new Error(message);
      }),
    );
  }

  upload(file: File): Observable<CV> {
    const formData = new FormData();
    formData.append('cv', file);
    return this.http.post<any>(`${this.BASE_URL}/cv/upload`, formData).pipe(
      map((res) => res.data.cv as CV),
      catchError((err) => {
        const message = err.error?.message || "Erreur lors de l'upload du CV";
        throw new Error(message);
      }),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<any>(`${this.BASE_URL}/cv/${id}`).pipe(
      map(() => undefined),
      catchError((err) => {
        const message = err.error?.message || 'Erreur lors de la suppression';
        throw new Error(message);
      }),
    );
  }

  getFile(id: number): Observable<Blob> {
    return this.http.get(`${this.BASE_URL}/cv/${id}/file`, { responseType: 'blob' }).pipe(
      catchError((err) => {
        throw new Error(err.error?.message || 'Erreur lors du chargement du PDF');
      }),
    );
  }

  getStatus(
    id: number,
  ): Observable<{
    id: number;
    filename: string;
    status: 'PENDING' | 'EXTRACTED' | 'FAILED';
    skillCount: number;
  }> {
    return this.http.get<any>(`${this.BASE_URL}/cv/${id}/status`).pipe(
      map((res) => res.data),
      catchError((err) => {
        const message = err.error?.message || 'Erreur lors de la récupération du statut';
        throw new Error(message);
      }),
    );
  }
}
