import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CvService } from '../../../../core/services/cv.service';
import { CV } from '../../../../core/models/cv.model';
import { CvCardComponent } from '../components/cv-card/cv-card.component';

@Component({
  selector: 'app-cv-list',
  standalone: true,
  imports: [RouterLink, CvCardComponent],
  templateUrl: './cv-list.component.html',
  styleUrl: './cv-list.component.scss'
})
export class CvListComponent implements OnInit {
  private cvService = inject(CvService);

  loading = signal(true);
  error = signal<string | null>(null);

  cvs = signal<CV[]>([]);
  total = signal(0);
  page = signal(1);
  limit = signal(10);
  totalPages = signal(0);

  ngOnInit(): void {
    this.loadCvs();
  }

  private loadCvs(): void {
    this.loading.set(true);
    this.error.set(null);

    this.cvService.getAll(this.page(), this.limit()).subscribe({
      next: (res) => {
        this.cvs.set(res.cvs);
        this.total.set(res.total);
        this.page.set(res.page);
        this.limit.set(res.limit);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  protected goToPage(p: number): void {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.loadCvs();
  }

  protected onDeleteRequested(id: number): void {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce CV ?');
    if (!confirmed) return;

    this.cvService.delete(id).subscribe({
      next: () => this.loadCvs(),
      error: (err) => this.error.set(err.message)
    });
  }
}
