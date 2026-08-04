import { Component, effect, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DxDataGridModule, DxSwitchModule, DxTemplateModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { AdminUser } from '../../../../../core/models/admin.model';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [DatePipe, DxDataGridModule, DxSwitchModule, DxTemplateModule],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss'
})
export class UsersTableComponent {
  users = input.required<AdminUser[]>();
  total = input(0);
  page = input(1);
  limit = input(10);
  loading = input(false);

  toggleActive = output<number>();
  roleChange = output<{ id: number; role: string }>();
  pageChange = output<{ page: number; limit: number }>();

  protected editingUserId = signal<number | null>(null);

  // The grid only ever holds the current server page, so the store reports the
  // server-side total to keep the pager's page count correct.
  protected readonly dataSource = new DataSource({
    store: new CustomStore({
      key: 'id',
      load: () => Promise.resolve({ data: this.users(), totalCount: this.total() })
    }),
    paginate: true
  });

  constructor() {
    effect(() => {
      this.users();
      this.total();
      this.dataSource.reload();
    });
  }

  protected onOptionChanged(e: { fullName: string; value?: unknown }): void {
    if (typeof e.value !== 'number') return;

    if (e.fullName === 'paging.pageIndex') {
      this.pageChange.emit({ page: e.value + 1, limit: this.limit() });
    } else if (e.fullName === 'paging.pageSize') {
      this.pageChange.emit({ page: 1, limit: e.value });
    }
  }

  protected onToggleActive(user: AdminUser): void {
    this.toggleActive.emit(user.id);
  }

  protected startRoleEdit(userId: number): void {
    this.editingUserId.set(this.editingUserId() === userId ? null : userId);
  }

  protected onRoleSelected(user: AdminUser, value: string): void {
    this.editingUserId.set(null);
    if (value && value !== user.role) {
      this.roleChange.emit({ id: user.id, role: value });
    }
  }

  protected getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  protected getRoleLabel(role: AdminUser['role']): string {
    return role === 'ADMIN' ? 'Admin' : 'Candidat';
  }
}
