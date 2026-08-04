import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { DxPopupModule, DxToastModule } from 'devextreme-angular';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';
import { JobStatsCardsComponent, JobStats } from './components/job-stats-cards/job-stats-cards.component';
import { JobCardComponent } from './components/job-card/job-card.component';
import { JobEditModalComponent, JobFormSubmit } from './components/job-edit-modal/job-edit-modal.component';

type ToastType = 'success' | 'error';

const STATS_FETCH_LIMIT = 1000;
const PAGE_SIZE = 9;

@Component({
  selector: 'app-admin-jobs',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DxToastModule,
    DxPopupModule,
    JobStatsCardsComponent,
    JobCardComponent,
    JobEditModalComponent,
  ],
  templateUrl: './admin-jobs.component.html',
  styleUrl: './admin-jobs.component.scss'
})
export class AdminJobsComponent implements OnInit {
  private jobService = inject(JobService);
  private destroyRef = inject(DestroyRef);

  jobs = signal<Job[]>([]);
  total = signal(0);
  page = signal(1);
  limit = signal(PAGE_SIZE);
  isLoading = signal(true);
  error = signal<string | null>(null);

  stats = signal<JobStats | null>(null);
  statsLoading = signal(true);

  protected searchControl = new FormControl('', { nonNullable: true });
  protected search = signal<string | undefined>(undefined);

  protected modalVisible = signal(false);
  protected editingJob = signal<Job | null>(null);
  protected saving = signal(false);

  protected deleteVisible = signal(false);
  protected jobToDelete = signal<Job | null>(null);
  protected deleting = signal(false);

  protected totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.limit())));

  protected toastVisible = signal(false);
  protected toastMessage = signal('');
  protected toastType = signal<ToastType>('success');

  ngOnInit(): void {
    this.loadJobs();
    this.loadStats();

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.search.set(value.trim() || undefined);
        this.page.set(1);
        this.loadJobs();
      });
  }

  protected openCreate(): void {
    this.editingJob.set(null);
    this.modalVisible.set(true);
  }

  protected openEdit(job: Job): void {
    this.editingJob.set(job);
    this.modalVisible.set(true);
  }

  protected closeModal(): void {
    this.modalVisible.set(false);
    this.editingJob.set(null);
  }

  protected onSave(event: JobFormSubmit): void {
    this.saving.set(true);
    const current = this.editingJob();

    const request$ = current
      ? this.jobService.update(current.id, event.payload).pipe(
          switchMap(updated =>
            this.jobService.setJobSkills(updated.id, event.skillNames).pipe(
              catchError(() => of(updated))
            )
          )
        )
      : this.jobService.create(event.payload).pipe(
          switchMap(created =>
            this.jobService.setJobSkills(created.id, event.skillNames).pipe(
              catchError(() => of(created))
            )
          )
        );

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeModal();
        this.showToast(
          current ? 'Offre modifiée avec succès.' : 'Offre créée avec succès.',
          'success'
        );
        this.loadJobs();
        this.loadStats();
      },
      error: (err) => {
        this.saving.set(false);
        this.showToast(err.message, 'error');
      }
    });
  }

  protected askDelete(job: Job): void {
    this.jobToDelete.set(job);
    this.deleteVisible.set(true);
  }

  protected cancelDelete(): void {
    this.deleteVisible.set(false);
    this.jobToDelete.set(null);
  }

  protected onDeleteVisibleChange(visible: boolean): void {
    if (!visible) this.cancelDelete();
  }

  protected confirmDelete(): void {
    const job = this.jobToDelete();
    if (!job) return;

    this.deleting.set(true);
    this.jobService.delete(job.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.cancelDelete();
        this.showToast('Offre supprimée avec succès.', 'success');
        this.loadJobs();
        this.loadStats();
      },
      error: (err) => {
        this.deleting.set(false);
        this.cancelDelete();
        this.showToast(err.message, 'error');
      }
    });
  }

  protected prevPage(): void {
    if (this.page() <= 1) return;
    this.page.update(p => p - 1);
    this.loadJobs();
  }

  protected nextPage(): void {
    if (this.page() >= this.totalPages()) return;
    this.page.update(p => p + 1);
    this.loadJobs();
  }

  private loadJobs(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.jobService.getAll({
      search: this.search(),
      page: this.page(),
      limit: this.limit()
    }).subscribe({
      next: (res) => {
        this.total.set(res.total);
        this.enrichWithSkills(res.jobs);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  private enrichWithSkills(jobs: Job[]): void {
    if (jobs.length === 0) {
      this.jobs.set([]);
      this.isLoading.set(false);
      return;
    }

    forkJoin(
      jobs.map(job =>
        this.jobService.getJobSkills(job.id).pipe(
          map(skills => ({ ...job, skills })),
          catchError(() => of({ ...job, skills: [] }))
        )
      )
    ).subscribe({
      next: (enriched) => {
        this.jobs.set(enriched);
        this.isLoading.set(false);
      },
      error: () => {
        this.jobs.set(jobs);
        this.isLoading.set(false);
      }
    });
  }

  private loadStats(): void {
    this.statsLoading.set(true);

    this.jobService.getAll({ page: 1, limit: STATS_FETCH_LIMIT }).subscribe({
      next: (res) => {
        const active = res.jobs.filter(j => j.isActive).length;
        const inactive = res.jobs.filter(j => !j.isActive).length;
        const matchedCandidates = res.jobs.reduce(
          (sum, j) => sum + (j.matchedCandidatesCount ?? 0),
          0
        );
        this.stats.set({ active, inactive, matchedCandidates });
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
