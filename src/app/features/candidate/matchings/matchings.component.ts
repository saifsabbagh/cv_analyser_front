import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DxPopupModule } from 'devextreme-angular';
import { MatchingService } from '../../../core/services/matching.service';
import { MatchResult } from '../../../core/models/matching.model';

@Component({
  selector: 'app-matchings',
  standalone: true,
  imports: [CommonModule, RouterLink, DxPopupModule],
  templateUrl: './matchings.component.html',
  styleUrls: ['./matchings.component.scss']
})
export class MatchingsComponent implements OnInit {
  private matchingService = inject(MatchingService);

  matchings = signal<MatchResult[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  currentPage = signal(1);
  totalPages = signal(1);

  isDeletePopupVisible = signal(false);
  matchingToDelete = signal<MatchResult | null>(null);
  isDeleting = signal(false);

  ngOnInit() {
    this.loadMatchings();
  }

  loadMatchings() {
    this.isLoading.set(true);
    this.matchingService.getMyResults(this.currentPage(), 10).subscribe({
      next: (res) => {
        this.matchings.set(res.results);
        this.totalPages.set(res.totalPages ?? 1);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadMatchings();
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadMatchings();
    }
  }

  getScoreBadgeClass(score: number): string {
    if (score >= 0.7) return 'badge-success';
    if (score >= 0.4) return 'badge-warning';
    return 'badge-danger';
  }

  openDeleteConfirm(matching: MatchResult, event: Event) {
    event.stopPropagation();
    this.matchingToDelete.set(matching);
    this.isDeletePopupVisible.set(true);
  }

  confirmDelete() {
    const target = this.matchingToDelete();
    if (!target) return;
    this.isDeleting.set(true);
    this.matchingService.deleteMatching(target.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.isDeletePopupVisible.set(false);
        this.matchingToDelete.set(null);
        this.loadMatchings();
      },
      error: (err) => {
        this.isDeleting.set(false);
        this.errorMessage.set(err.message);
      }
    });
  }

  getSkeletonArray(): number[] {
    return Array(5).fill(0);
  }
}