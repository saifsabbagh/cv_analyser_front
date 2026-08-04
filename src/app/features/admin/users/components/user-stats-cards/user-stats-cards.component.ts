import { Component, input } from '@angular/core';
import { KpiCardComponent } from '../../../../../shared/components/widgets/kpi-card/kpi-card.component';

export interface UserStats {
  total: number;
  active: number;
  suspended: number;
}

@Component({
  selector: 'app-user-stats-cards',
  standalone: true,
  imports: [KpiCardComponent],
  templateUrl: './user-stats-cards.component.html',
  styleUrl: './user-stats-cards.component.scss'
})
export class UserStatsCardsComponent {
  stats = input<UserStats | null>(null);
  loading = input(false);
}
