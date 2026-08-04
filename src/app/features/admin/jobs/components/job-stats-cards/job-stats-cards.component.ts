import { Component, input } from '@angular/core';
import { KpiCardComponent } from '../../../../../shared/components/widgets/kpi-card/kpi-card.component';

export interface JobStats {
  active: number;
  matchedCandidates: number;
  inactive: number;
}

@Component({
  selector: 'app-job-stats-cards',
  standalone: true,
  imports: [KpiCardComponent],
  templateUrl: './job-stats-cards.component.html',
  styleUrl: './job-stats-cards.component.scss'
})
export class JobStatsCardsComponent {
  stats = input<JobStats | null>(null);
  loading = input(false);
}
