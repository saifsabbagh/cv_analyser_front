import { Component, effect, inject, input, signal } from '@angular/core';
import { AdminService } from '../../../../../core/services/admin.service';
import { TopCandidate } from '../../../../../core/models/admin.model';

@Component({
  selector: 'app-top-candidates-panel',
  standalone: true,
  templateUrl: './top-candidates-panel.component.html',
  styleUrl: './top-candidates-panel.component.scss'
})
export class TopCandidatesPanelComponent {
  private adminService = inject(AdminService);

  jobId = input.required<number>();

  protected candidates = signal<TopCandidate[]>([]);
  protected isLoading = signal(true);
  protected error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.jobId();
      if (!id) return;

      this.isLoading.set(true);
      this.error.set(null);

      this.adminService.getTopCandidates(id).subscribe({
        next: (res) => {
          this.candidates.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err.message);
          this.isLoading.set(false);
        }
      });
    });
  }

  protected getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  protected getRecommendationExcerpt(text: string, max = 80): string {
    if (!text) return '';
    const clean = text.trim();
    return clean.length > max ? clean.slice(0, max).trimEnd() + '…' : clean;
  }

  protected getRankClass(rank: number): string {
    switch (rank) {
      case 1:
        return 'podium-rank podium-rank--first';
      case 2:
        return 'podium-rank podium-rank--second';
      default:
        return 'podium-rank podium-rank--third';
    }
  }

  protected getScoreColor(scorePercent: number): string {
    if (scorePercent >= 70) return 'var(--color-success)';
    if (scorePercent >= 40) return 'var(--color-warning)';
    return 'var(--color-error)';
  }
}
