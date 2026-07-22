import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CvService } from '../../../core/services/cv.service';
import { JobService } from '../../../core/services/job.service';
import { MatchingService } from '../../../core/services/matching.service';
import { CV } from '../../../core/models/cv.model';
import { Job } from '../../../core/models/job.model';
import { MatchResult } from '../../../core/models/matching.model';
import { groupByWeek, categorizeScores } from '../../../shared/utils/date.utils';
import { KpiCardComponent } from '../../../shared/components/widgets/kpi-card/kpi-card.component';
import { BarChartWidgetComponent } from '../../../shared/components/widgets/bar-chart-widget/bar-chart-widget.component';
import { DonutChartWidgetComponent } from '../../../shared/components/widgets/donut-chart-widget/donut-chart-widget.component';
import { DataTableWidgetComponent } from '../../../shared/components/widgets/data-table-widget/data-table-widget.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    KpiCardComponent,
    BarChartWidgetComponent,
    DonutChartWidgetComponent,
    DataTableWidgetComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private cvService = inject(CvService);
  private jobService = inject(JobService);
  private matchingService = inject(MatchingService);

  loading = signal(true);

  cvs = signal<CV[]>([]);
  jobs = signal<Job[]>([]);
  matchResults = signal<MatchResult[]>([]);

  cvError = signal<string | null>(null);
  jobError = signal<string | null>(null);
  matchError = signal<string | null>(null);

  totalCvs = computed(() => this.cvs().length);
  bestScore = computed(() => {
    const results = this.matchResults();
    return results.length ? Math.max(...results.map(r => r.scorePercent)) : 0;
  });
  totalJobs = computed(() => this.jobs().length);
  totalMatchings = computed(() => this.matchResults().length);

  weeklyMatchings = computed(() => groupByWeek(this.matchResults(), 'createdAt'));
  scoreDistribution = computed(() => categorizeScores(this.matchResults().map(r => r.scorePercent)));
  topMatchings = computed(() => [...this.matchResults()].sort((a, b) => b.scorePercent - a.scorePercent).slice(0, 5));

  topMatchingsColumns = [
    { dataField: 'job.title', caption: 'Offre' },
    { dataField: 'job.location', caption: 'Localisation' },
    {
      dataField: 'scorePercent',
      caption: 'Score',
      dataType: 'number',
      customizeText: (e: any) => `${e.value}%`,
      cellTemplate: (cellElement: HTMLElement, cellInfo: any) => {
        cellElement.textContent = `${cellInfo.value}%`;
        const score = cellInfo.value / 100;
        if (score >= 0.7) cellElement.style.color = 'var(--color-success)';
        else if (score >= 0.4) cellElement.style.color = 'var(--color-warning)';
        else cellElement.style.color = 'var(--color-error)';
        cellElement.style.fontWeight = '600';
      }
    },
    {
      dataField: 'createdAt',
      caption: 'Date',
      dataType: 'date',
      format: 'dd/MM/yyyy'
    }
  ];

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);

    forkJoin({
      cvs: this.cvService.getAll(1, 100).pipe(
        catchError(err => {
          this.cvError.set(err.message);
          return of({ cvs: [], total: 0, page: 1, limit: 100, totalPages: 0 });
        })
      ),
      jobs: this.jobService.getAll({ page: 1, limit: 100 }).pipe(
        catchError(err => {
          this.jobError.set(err.message);
          return of({ jobs: [], total: 0, page: 1, limit: 100, totalPages: 0 });
        })
      ),
      matches: this.matchingService.getMyResults(1, 50).pipe(
        catchError(err => {
          this.matchError.set(err.message);
          return of({ results: [], total: 0, page: 1, limit: 50, totalPages: 0 });
        })
      ),
    }).subscribe({
      next: (results) => {
        this.cvs.set(results.cvs.cvs);
        this.jobs.set(results.jobs.jobs);
        this.matchResults.set(results.matches.results);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
