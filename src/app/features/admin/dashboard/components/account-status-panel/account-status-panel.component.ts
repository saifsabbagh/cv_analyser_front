import { Component, computed, input } from '@angular/core';
import { DashboardStats } from '../../../../../core/models/admin.model';

@Component({
  selector: 'app-account-status-panel',
  standalone: true,
  imports: [],
  templateUrl: './account-status-panel.component.html',
  styleUrl: './account-status-panel.component.scss'
})
export class AccountStatusPanelComponent {
  stats = input.required<DashboardStats['users']>();

  protected activeCount = computed(() => {
    const { total, inactive } = this.stats();
    return Math.max(total - inactive, 0);
  });

  protected inactiveCount = computed(() => this.stats().inactive);

  protected activePercent = computed(() => this.toPercent(this.activeCount()));

  protected inactivePercent = computed(() => this.toPercent(this.inactiveCount()));

  private toPercent(count: number): number {
    const total = this.stats().total;
    return total > 0 ? Math.round((count / total) * 100) : 0;
  }
}
