import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DxToastModule } from 'devextreme-angular';
import { SkillService } from '../../../core/services/skill.service';
import { Skill, SkillFilters } from '../../../core/models/skill.model';
import { SkillStatsCardsComponent, SkillStats } from './components/skill-stats-cards/skill-stats-cards.component';
import { SkillCreateModalComponent } from './components/skill-create-modal/skill-create-modal.component';
import { SkillsTableComponent } from './components/skills-table/skills-table.component';

type ToastType = 'success' | 'error';

// Le backend n'expose pas de totaux d'usage globaux : on récupère donc la
// totalité des compétences en une passe pour agréger les compteurs.
const STATS_FETCH_LIMIT = 1000;

@Component({
  selector: 'app-admin-skills',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DxToastModule,
    SkillStatsCardsComponent,
    SkillCreateModalComponent,
    SkillsTableComponent,
  ],
  templateUrl: './admin-skills.component.html',
  styleUrl: './admin-skills.component.scss'
})
export class AdminSkillsComponent implements OnInit {
  private skillService = inject(SkillService);
  private destroyRef = inject(DestroyRef);

  skills = signal<Skill[]>([]);
  total = signal(0);
  filters = signal<SkillFilters>({ page: 1, limit: 10 });
  isLoading = signal(true);
  error = signal<string | null>(null);

  stats = signal<SkillStats | null>(null);
  statsLoading = signal(true);

  protected searchControl = new FormControl('', { nonNullable: true });
  protected modalVisible = signal(false);
  protected saving = signal(false);

  protected page = computed(() => this.filters().page ?? 1);
  protected limit = computed(() => this.filters().limit ?? 10);

  protected toastVisible = signal(false);
  protected toastMessage = signal('');
  protected toastType = signal<ToastType>('success');

  ngOnInit(): void {
    this.loadSkills();
    this.loadStats();

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        const search = value.trim();
        this.filters.set({
          ...this.filters(),
          search: search || undefined,
          page: 1
        });
        this.loadSkills();
      });
  }

  protected onPageChange(event: { page: number; limit: number }): void {
    const current = this.filters();
    if (current.page === event.page && current.limit === event.limit) return;

    this.filters.set({ ...current, page: event.page, limit: event.limit });
    this.loadSkills();
  }

  protected openModal(): void {
    this.modalVisible.set(true);
  }

  protected closeModal(): void {
    this.modalVisible.set(false);
  }

  protected onCreate(name: string): void {
    this.saving.set(true);

    this.skillService.create(name).subscribe({
      next: () => {
        this.saving.set(false);
        this.modalVisible.set(false);
        this.showToast('Compétence créée avec succès.', 'success');
        this.loadSkills();
        this.loadStats();
      },
      error: (err) => {
        this.saving.set(false);
        this.showToast(err.message, 'error');
      }
    });
  }

  protected onRename(event: { id: number; name: string }): void {
    this.skillService.update(event.id, event.name).subscribe({
      next: (updated) => {
        this.skills.update(list =>
          list.map(s => (s.id === updated.id ? { ...s, name: updated.name } : s))
        );
        this.showToast('Compétence modifiée avec succès.', 'success');
      },
      error: (err) => this.showToast(err.message, 'error')
    });
  }

  protected onRemove(id: number): void {
    this.skillService.delete(id).subscribe({
      next: () => {
        this.showToast('Compétence supprimée avec succès.', 'success');
        this.loadSkills();
        this.loadStats();
      },
      error: (err) => this.showToast(err.message, 'error')
    });
  }

  private loadSkills(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.skillService.getAll(this.filters()).subscribe({
      next: (res) => {
        this.skills.set(res.skills);
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

    this.skillService.getAll({ page: 1, limit: STATS_FETCH_LIMIT }).subscribe({
      next: (res) => {
        this.stats.set({
          total: res.total,
          jobUsage: res.skills.reduce((sum, s) => sum + (s._count?.jobSkills ?? 0), 0),
          cvUsage: res.skills.reduce((sum, s) => sum + (s._count?.cvSkills ?? 0), 0)
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
