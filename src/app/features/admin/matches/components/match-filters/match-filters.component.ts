import { Component, DestroyRef, OnInit, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatchFilters } from '../../../../../core/models/admin.model';
import { Job } from '../../../../../core/models/job.model';
import { JobService } from '../../../../../core/services/job.service';

@Component({
  selector: 'app-match-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './match-filters.component.html',
  styleUrl: './match-filters.component.scss'
})
export class MatchFiltersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private jobService = inject(JobService);

  filtersChange = output<MatchFilters>();

  protected jobs = signal<Job[]>([]);
  protected jobsLoading = signal(true);

  protected form = this.fb.group({
    search: '',
    jobId: null as number | null,
    minScore: null as number | null,
    maxScore: null as number | null,
    archived: 'false'
  });

  ngOnInit(): void {
    this.loadJobs();

    this.form.controls.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitFilters());

    this.form.controls.jobId.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitFilters());

    this.form.controls.minScore.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitFilters());

    this.form.controls.maxScore.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitFilters());

    this.form.controls.archived.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitFilters());
  }

  protected resetFilters(): void {
    this.form.reset(
      { search: '', jobId: null, minScore: null, maxScore: null, archived: 'false' },
      { emitEvent: false }
    );
    this.emitFilters();
  }

  private loadJobs(): void {
    this.jobsLoading.set(true);

    this.jobService.getAll({ limit: 1000 }).subscribe({
      next: (res) => {
        this.jobs.set(res.jobs);
        this.jobsLoading.set(false);
      },
      error: () => this.jobsLoading.set(false)
    });
  }

  private emitFilters(): void {
    const { search, jobId, minScore, maxScore, archived } = this.form.getRawValue();
    const filters: MatchFilters = { archived: archived === 'true' };

    if (search && search.trim()) {
      filters.search = search.trim();
    }
    if (jobId) {
      filters.jobId = jobId;
    }
    if (minScore !== null && minScore !== undefined && !isNaN(minScore)) {
      filters.minScore = this.toRawScore(minScore);
    }
    if (maxScore !== null && maxScore !== undefined && !isNaN(maxScore)) {
      filters.maxScore = this.toRawScore(maxScore);
    }

    this.filtersChange.emit(filters);
  }

  private toRawScore(percent: number): number {
    const clamped = Math.min(Math.max(percent, 0), 100);
    return Math.round(clamped) / 100;
  }
}
