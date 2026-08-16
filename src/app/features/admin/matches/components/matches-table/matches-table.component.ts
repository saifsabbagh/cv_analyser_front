import { Component, effect, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DxCircularGaugeModule, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { AdminMatchResult } from '../../../../../core/models/admin.model';

@Component({
  selector: 'app-matches-table',
  standalone: true,
  imports: [DatePipe, DxCircularGaugeModule, DxDataGridModule, DxTemplateModule],
  templateUrl: './matches-table.component.html',
  styleUrl: './matches-table.component.scss'
})
export class MatchesTableComponent {
  matches = input.required<AdminMatchResult[]>();
  total = input(0);
  page = input(1);
  limit = input(10);
  loading = input(false);

  archiveToggle = output<number>();
  viewProfile = output<AdminMatchResult>();
  pageChange = output<{ page: number; limit: number }>();

  protected sortDirection = 'desc';

  protected readonly dataSource = new DataSource({
    store: new CustomStore({
      key: 'id',
      load: () => {
        const data = [...this.matches()].sort((a, b) =>
          this.sortDirection === 'asc'
            ? a.scorePercent - b.scorePercent
            : b.scorePercent - a.scorePercent
        );
        return Promise.resolve({ data, totalCount: this.total() });
      }
    }),
    paginate: true
  });

  protected readonly successHex = this.resolveCssVar('--color-success');
  protected readonly warningHex = this.resolveCssVar('--color-warning');
  protected readonly dangerHex = this.resolveCssVar('--color-error');

  constructor() {
    effect(() => {
      this.matches();
      this.total();
      this.dataSource.reload();
    });
  }

  protected onOptionChanged(e: { fullName: string; value?: unknown }): void {
    if (
      typeof e.value === 'string' &&
      (e.value === 'asc' || e.value === 'desc') &&
      e.fullName.includes('sortOrder')
    ) {
      this.sortDirection = e.value;
      this.dataSource.reload();
    }

    if (typeof e.value !== 'number') return;

    if (e.fullName === 'paging.pageIndex') {
      this.pageChange.emit({ page: e.value + 1, limit: this.limit() });
    } else if (e.fullName === 'paging.pageSize') {
      this.pageChange.emit({ page: 1, limit: e.value });
    }
  }

  protected onArchiveToggle(match: AdminMatchResult): void {
    this.archiveToggle.emit(match.id);
  }

  protected onViewProfile(match: AdminMatchResult): void {
    this.viewProfile.emit(match);
  }

  protected getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  protected scoreBadgeClass(scorePercent: number): string {
    if (scorePercent >= 70) return 'badge-success';
    if (scorePercent >= 40) return 'badge-warning';
    return 'badge-danger';
  }

  protected scoreColorHex(scorePercent: number): string {
    if (scorePercent >= 70) return this.successHex;
    if (scorePercent >= 40) return this.warningHex;
    return this.dangerHex;
  }

  protected getMissingSkills(match: AdminMatchResult): string[] {
    return match.missingSkills ?? [];
  }

  protected getMissingExtra(match: AdminMatchResult): number {
    const skills = match.missingSkills ?? [];
    return skills.length > 3 ? skills.length - 3 : 0;
  }

  private resolveCssVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
}
