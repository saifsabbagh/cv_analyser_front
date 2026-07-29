import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { forkJoin, interval, Subject, switchMap, takeUntil, takeWhile } from 'rxjs';
import { DxPopupModule } from 'devextreme-angular';
import { JobService } from '../../../../core/services/job.service';
import { MatchingService } from '../../../../core/services/matching.service';
import { CvService } from '../../../../core/services/cv.service';
import { Job, JobSkill } from '../../../../core/models/job.model';
import { CV } from '../../../../core/models/cv.model';

@Component({
  selector: 'app-candidate-job-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DxPopupModule],
  templateUrl: './candidate-job-detail.component.html',
  styleUrls: ['./candidate-job-detail.component.scss'],
})
export class CandidateJobDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobService);
  private matchingService = inject(MatchingService);
  private cvService = inject(CvService);

  job = signal<Job | null>(null);
  skills = signal<JobSkill[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  isMatchPopupVisible = signal(false);
  myCvs = signal<CV[]>([]);
  selectedCvId = signal<number | null>(null);
  isMatchLoading = signal(false);
  matchError = signal('');

  uploadMode = signal(false);
  selectedFile = signal<File | null>(null);
  isUploading = signal(false);
  uploadError = signal('');
  pollingStatus = signal<'PENDING' | 'EXTRACTED' | 'FAILED' | null>(null);

  private pollDestroy$ = new Subject<void>();

  ngOnInit() {
    const jobId = Number(this.route.snapshot.paramMap.get('id'));
    forkJoin({
      job: this.jobService.getJobById(jobId),
      skills: this.jobService.getJobSkills(jobId),
    }).subscribe({
      next: ({ job, skills }) => {
        this.job.set(job);
        this.skills.set(skills);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      },
    });
  }

  ngOnDestroy() {
    this.pollDestroy$.next();
    this.pollDestroy$.complete();
  }

  openMatchPopup() {
    this.matchError.set('');
    this.selectedCvId.set(null);
    this.uploadMode.set(false);
    this.pollingStatus.set(null);
    this.isMatchPopupVisible.set(true);
    this.loadMyCvs();
  }

  loadMyCvs() {
    this.cvService.getAll(1, 50).subscribe({
      next: (res) => {
        this.myCvs.set(res.cvs.filter((c: CV) => c.status === 'EXTRACTED'));
      },
      error: () => {
        this.matchError.set('Impossible de charger vos CVs.');
      },
    });
  }

  toggleUploadMode() {
    this.uploadMode.set(!this.uploadMode());
    this.uploadError.set('');
    this.selectedFile.set(null);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.uploadError.set('Seuls les fichiers PDF sont acceptés.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.uploadError.set('Le fichier ne doit pas dépasser 10 Mo.');
      return;
    }

    this.uploadError.set('');
    this.selectedFile.set(file);
  }

  uploadNewCv() {
    const file = this.selectedFile();
    if (!file) return;

    this.isUploading.set(true);
    this.uploadError.set('');

    this.cvService.upload(file).subscribe({
      next: (newCv) => {
        this.isUploading.set(false);
        this.uploadMode.set(false);
        this.pollingStatus.set('PENDING');
        this.startPollingStatus(newCv.id);
      },
      error: (err) => {
        this.isUploading.set(false);
        this.uploadError.set(err.message);
      },
    });
  }

  private startPollingStatus(cvId: number) {
    interval(2000)
      .pipe(
        switchMap(() => this.cvService.getStatus(cvId)),
        takeWhile((res) => res.status === 'PENDING', true),
        takeUntil(this.pollDestroy$),
      )
      .subscribe({
        next: (res) => {
          this.pollingStatus.set(res.status);

          if (res.status === 'EXTRACTED') {
            const currentJob = this.job();
            if (currentJob) {
              this.isMatchLoading.set(true);
              this.matchingService.launchMatching(cvId, currentJob.id).subscribe({
                next: (result) => {
                  this.isMatchLoading.set(false);
                  this.isMatchPopupVisible.set(false);
                  this.router.navigate(['/candidate/matchings', result.id]);
                },
                error: (err) => {
                  this.isMatchLoading.set(false);
                  this.matchError.set(err.message);
                  this.pollingStatus.set(null);
                },
              });
            }
          }
        },
        error: () => {
          this.uploadError.set("Erreur lors du suivi de l'analyse.");
          this.pollingStatus.set(null);
        },
      });
  }

  selectCv(cvId: number) {
    this.selectedCvId.set(this.selectedCvId() === cvId ? null : cvId);
  }

  confirmMatch() {
    const id = this.selectedCvId();
    const currentJob = this.job();
    if (!id || !currentJob) return;
    this.isMatchLoading.set(true);
    this.matchingService.launchMatching(id, currentJob.id).subscribe({
      next: (result) => {
        this.isMatchLoading.set(false);
        this.isMatchPopupVisible.set(false);
        this.router.navigate(['/candidate/matchings', result.id]);
      },
      error: (err) => {
        this.isMatchLoading.set(false);
        this.matchError.set(err.message);
      },
    });
  }

  get popupWidth(): string {
    return window.innerWidth < 640 ? '90%' : '480px';
  }
}
