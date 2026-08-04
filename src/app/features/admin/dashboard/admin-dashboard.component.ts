import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardStats } from '../../../core/models/admin.model';
import { getStatusLabel } from '../../../shared/utils/cv.utils';
import { KpiCardComponent } from '../../../shared/components/widgets/kpi-card/kpi-card.component';
import { BarChartWidgetComponent } from '../../../shared/components/widgets/bar-chart-widget/bar-chart-widget.component';
import { DonutChartWidgetComponent } from '../../../shared/components/widgets/donut-chart-widget/donut-chart-widget.component';
import { AccountStatusPanelComponent } from './components/account-status-panel/account-status-panel.component';
import { RecentActivityPanelComponent } from './components/recent-activity-panel/recent-activity-panel.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    KpiCardComponent,
    BarChartWidgetComponent,
    DonutChartWidgetComponent,
    AccountStatusPanelComponent,
    RecentActivityPanelComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);

  loading = signal(true);
  error = signal<string | null>(null);
  stats = signal<DashboardStats | null>(null);

  protected totalUsers = computed(() => this.stats()?.users.total ?? 0);
  protected activeJobs = computed(() => this.stats()?.jobs.active ?? 0);
  protected totalCvs = computed(() => this.stats()?.cvs.total ?? 0);
  protected avgScorePercent = computed(() => Math.round((this.stats()?.matches.avgScore ?? 0) * 100));

  protected accountStats = computed(() => this.stats()?.users ?? null);

  protected cvsByStatus = computed(() => {
    const byStatus = this.stats()?.cvs.byStatus;
    if (!byStatus) return [];
    return [
      { statut: getStatusLabel('PENDING'), count: byStatus.PENDING },
      { statut: getStatusLabel('EXTRACTED'), count: byStatus.EXTRACTED },
      { statut: getStatusLabel('FAILED'), count: byStatus.FAILED },
    ];
  });

  protected roleDistribution = computed(() => {
    const users = this.accountStats();
    if (!users) return [];
    return [
      { role: 'Administrateurs', valeur: users.admins },
      { role: 'Candidats', valeur: users.candidates },
    ];
  });

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.loading.set(true);
    this.error.set(null);

    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}
