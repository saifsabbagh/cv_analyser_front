import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DxToastModule } from 'devextreme-angular';
import { AdminService } from '../../../core/services/admin.service';
import { AdminUser, UserFilters } from '../../../core/models/admin.model';
import { UserFiltersComponent } from './components/user-filters/user-filters.component';
import { UserStatsCardsComponent, UserStats } from './components/user-stats-cards/user-stats-cards.component';
import { UsersTableComponent } from './components/users-table/users-table.component';

type ToastType = 'success' | 'error';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    DxToastModule,
    UserFiltersComponent,
    UserStatsCardsComponent,
    UsersTableComponent,
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent implements OnInit {
  private adminService = inject(AdminService);

  users = signal<AdminUser[]>([]);
  total = signal(0);
  filters = signal<UserFilters>({ page: 1, limit: 10 });
  isLoading = signal(true);
  error = signal<string | null>(null);

  stats = signal<UserStats | null>(null);
  statsLoading = signal(true);

  protected page = computed(() => this.filters().page ?? 1);
  protected limit = computed(() => this.filters().limit ?? 10);

  protected toastVisible = signal(false);
  protected toastMessage = signal('');
  protected toastType = signal<ToastType>('success');

  ngOnInit(): void {
    this.loadUsers();
    this.loadStats();
  }

  protected onFiltersChange(filters: UserFilters): void {
    this.filters.set({ ...filters, page: 1, limit: this.limit() });
    this.loadUsers();
  }

  protected onPageChange(event: { page: number; limit: number }): void {
    const current = this.filters();
    if (current.page === event.page && current.limit === event.limit) return;

    this.filters.set({ ...current, page: event.page, limit: event.limit });
    this.loadUsers();
  }

  protected onToggleActive(id: number): void {
    this.adminService.toggleUserActive(id).subscribe({
      next: (updated) => {
        this.replaceUser(updated);
        this.applyStatusDelta(updated.isActive);
        this.showToast(
          updated.isActive ? 'Compte activé avec succès.' : 'Compte désactivé avec succès.',
          'success'
        );
      },
      error: (err) => this.showToast(err.message, 'error')
    });
  }

  protected onRoleChange(event: { id: number; role: string }): void {
    this.adminService.changeUserRole(event.id, event.role as 'ADMIN' | 'CANDIDATE').subscribe({
      next: (updated) => {
        this.replaceUser(updated);
        this.showToast('Rôle modifié avec succès.', 'success');
      },
      error: (err) => this.showToast(err.message, 'error')
    });
  }

  private loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.adminService.getUsers(this.filters()).subscribe({
      next: (res) => {
        this.users.set(res.users);
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
          total: res.users.total,
          active: Math.max(res.users.total - res.users.inactive, 0),
          suspended: res.users.inactive
        });
        this.statsLoading.set(false);
      },
      error: () => this.statsLoading.set(false)
    });
  }

  private replaceUser(updated: AdminUser): void {
    this.users.update(list => list.map(u => (u.id === updated.id ? updated : u)));
  }

  private applyStatusDelta(isNowActive: boolean): void {
    this.stats.update(current => {
      if (!current) return current;
      const delta = isNowActive ? 1 : -1;
      return {
        ...current,
        active: current.active + delta,
        suspended: current.suspended - delta
      };
    });
  }

  private showToast(message: string, type: ToastType): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.toastVisible.set(true);
  }
}
