import { Component, input } from '@angular/core';
import { KpiCardComponent } from '../../../../../shared/components/widgets/kpi-card/kpi-card.component';

export interface SkillStats {
  total: number;
  jobUsage: number;
  cvUsage: number;
}

@Component({
  selector: 'app-skill-stats-cards',
  standalone: true,
  imports: [KpiCardComponent],
  templateUrl: './skill-stats-cards.component.html',
  styleUrl: './skill-stats-cards.component.scss'
})
export class SkillStatsCardsComponent {
  stats = input<SkillStats | null>(null);
  loading = input(false);
}
