import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CvService } from '../../../../core/services/cv.service';
import { CVDetail } from '../../../../core/models/cv.model';
import { getStatusLabel, getStatusBadgeClass } from '../../../../shared/utils/cv.utils';

@Component({
  selector: 'app-cv-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cv-detail.component.html',
  styleUrl: './cv-detail.component.scss'
})
export class CvDetailComponent implements OnInit, OnDestroy {
  private cvService = inject(CvService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  loading = signal(true);
  error = signal<string | null>(null);
  cv = signal<CVDetail | null>(null);

  activeTab = signal<'skills' | 'pdf'>('skills');
  pdfUrl = signal<SafeResourceUrl | null>(null);
  pdfLoading = signal(false);
  pdfError = signal<string | null>(null);
  private objectUrl: string | null = null;

  protected getStatusLabel = getStatusLabel;
  protected getStatusBadgeClass = getStatusBadgeClass;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.error.set('Identifiant du CV introuvable.');
      this.loading.set(false);
      return;
    }
    const id = Number(idParam);
    if (isNaN(id)) {
      this.error.set('Identifiant du CV invalide.');
      this.loading.set(false);
      return;
    }
    this.loadCv(id);
  }

  ngOnDestroy(): void {
    this.revokePdfUrl();
  }

  private loadCv(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.cvService.getById(id).subscribe({
      next: (cv) => {
        this.cv.set(cv);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  protected loadPdf(id: number): void {
    if (this.pdfUrl()) return;

    this.pdfLoading.set(true);
    this.pdfError.set(null);

    this.cvService.getFile(id).subscribe({
      next: (blob) => {
        this.objectUrl = URL.createObjectURL(blob);
        this.pdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl));
        this.pdfLoading.set(false);
      },
      error: () => {
        this.pdfError.set('Impossible de charger le PDF');
        this.pdfLoading.set(false);
      }
    });
  }

  protected onDelete(): void {
    const cv = this.cv();
    if (!cv) return;

    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce CV ?');
    if (!confirmed) return;

    this.cvService.delete(cv.id).subscribe({
      next: () => this.router.navigate(['/candidate/cv']),
      error: (err) => this.error.set(err.message)
    });
  }

  protected switchTab(tab: 'skills' | 'pdf'): void {
    this.activeTab.set(tab);
    const cv = this.cv();
    if (tab === 'pdf' && cv && !this.pdfUrl() && !this.pdfLoading()) {
      this.loadPdf(cv.id);
    }
  }

  private revokePdfUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  protected formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
