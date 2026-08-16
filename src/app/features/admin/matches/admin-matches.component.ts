import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DxToastModule } from 'devextreme-angular';
import { AdminService } from '../../../core/services/admin.service';
import { AdminMatchResult, MatchFilters } from '../../../core/models/admin.model';
import { MatchFiltersComponent } from './components/match-filters/match-filters.component';
import { MatchStatsCardsComponent, MatchStats } from './components/match-stats-cards/match-stats-cards.component';
import { MatchesTableComponent } from './components/matches-table/matches-table.component';
import { TopCandidatesPanelComponent } from './components/top-candidates-panel/top-candidates-panel.component';

type ToastType = 'success' | 'error';

@Component({
  selector: 'app-admin-matches',
  standalone: true,
  imports: [
    DxToastModule,
    MatchFiltersComponent,
    MatchStatsCardsComponent,
    MatchesTableComponent,
    TopCandidatesPanelComponent
  ],
  templateUrl: './admin-matches.component.html',
  styleUrl: './admin-matches.component.scss'
})
export class AdminMatchesComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);

  matches = signal<AdminMatchResult[]>([]);
  total = signal(0);
  filters = signal<MatchFilters>({ page: 1, limit: 10, archived: false });
  isLoading = signal(true);
  error = signal<string | null>(null);

  stats = signal<MatchStats | null>(null);
  statsLoading = signal(true);

  protected page = computed(() => this.filters().page ?? 1);
  protected limit = computed(() => this.filters().limit ?? 10);

  protected selectedJobId = computed(() => this.filters().jobId);

  protected displayMatches = computed(() => {
    const search = this.filters().search?.toLowerCase();
    if (!search) return this.matches();

    return this.matches().filter(
      m =>
        m.user.name.toLowerCase().includes(search) ||
        m.user.email.toLowerCase().includes(search)
    );
  });

  protected toastVisible = signal(false);
  protected toastMessage = signal('');
  protected toastType = signal<ToastType>('success');

  ngOnInit(): void {
    this.loadMatches();
    this.loadStats();
  }

  protected onFiltersChange(filters: MatchFilters): void {
    this.filters.set({ ...filters, page: 1, limit: this.limit() });
    this.loadMatches();
  }

  protected onPageChange(event: { page: number; limit: number }): void {
    const current = this.filters();
    if (current.page === event.page && current.limit === event.limit) return;

    this.filters.set({ ...current, page: event.page, limit: event.limit });
    this.loadMatches();
  }

  protected onArchiveToggle(id: number): void {
    this.adminService.toggleMatchArchived(id).subscribe({
      next: (updated) => {
        this.matches.update(list => list.filter(m => m.id !== id));
        this.total.update(t => Math.max(t - 1, 0));
        this.showToast(
          updated.archived
            ? 'Matching archivé avec succès.'
            : 'Matching désarchivé avec succès.',
          'success'
        );
      },
      error: (err) => this.showToast(err.message, 'error')
    });
  }

  protected onViewProfile(): void {
    this.router.navigate(['/admin/users']);
  }

  private loadMatches(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.adminService.getAllMatches(this.filters()).subscribe({
      next: (res) => {
        this.matches.set(res.results);
        this.total.set(res.total);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  private loadStats(): void {
    this.statsLoading.set(true);

    this.adminService.getDashboardStats().subscribe({
      next: (res) => {
        this.stats.set({
          total: res.matches.total,
          avgScore: res.matches.avgScore
        });
        this.statsLoading.set(false);
      },
      error: () => this.statsLoading.set(false)
    });
  }

  private showToast(message: string, type: ToastType): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.toastVisible.set(true);
  }
}
