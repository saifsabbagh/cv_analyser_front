import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { DxCircularGaugeModule, DxPopupModule } from 'devextreme-angular';
import { MatchingService } from '../../../../core/services/matching.service';
import { MatchResult } from '../../../../core/models/matching.model';

@Component({
  selector: 'app-matching-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DxCircularGaugeModule, DxPopupModule],
  templateUrl: './matching-detail.component.html',
  styleUrls: ['./matching-detail.component.scss']
})
export class MatchingDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private matchingService = inject(MatchingService);

  matching = signal<MatchResult | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  isDeletePopupVisible = signal(false);
  isDeleting = signal(false);

  scorePercent = computed(() => {
    const m = this.matching();
    return m ? m.scorePercent : 0;
  });

  scoreColorVar = computed(() => {
    const s = this.matching()?.score ?? 0;
    if (s >= 0.7) return 'var(--color-success)';
    if (s >= 0.4) return 'var(--color-warning)';
    return 'var(--color-error)';
  });

  scoreColorHex = computed(() => {
    const s = this.matching()?.score ?? 0;
    let varName: string;
    if (s >= 0.7) varName = '--color-success';
    else if (s >= 0.4) varName = '--color-warning';
    else varName = '--color-error';
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#16A34A';
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.matchingService.getById(id).subscribe({
      next: (res) => {
        this.matching.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  confirmDelete() {
    const m = this.matching();
    if (!m) return;
    this.isDeleting.set(true);
    this.matchingService.deleteMatching(m.id).subscribe({
      next: () => {
        this.router.navigate(['/candidate/matchings']);
      },
      error: (err) => {
        this.isDeleting.set(false);
        this.errorMessage.set(err.message);
      }
    });
  }
}