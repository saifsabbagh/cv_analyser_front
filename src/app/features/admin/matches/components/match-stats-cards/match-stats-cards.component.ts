import { Component, input } from '@angular/core';
import { KpiCardComponent } from '../../../../../shared/components/widgets/kpi-card/kpi-card.component';

export interface MatchStats {
  total: number;
  avgScore: number;
}

@Component({
  selector: 'app-match-stats-cards',
  standalone: true,
  imports: [KpiCardComponent],
  templateUrl: './match-stats-cards.component.html',
  styleUrl: './match-stats-cards.component.scss'
})
export class MatchStatsCardsComponent {
  stats = input<MatchStats | null>(null);
  loading = input(false);
}
