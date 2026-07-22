import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
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
  styleUrls: ['./candidate-job-detail.component.scss']
})
export class CandidateJobDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobService);
  private matchingService = inject(MatchingService);
  private cvService = inject(CvService);

  job: Job | null = null;
  skills: JobSkill[] = [];
  isLoading = true;
  errorMessage = '';

  isMatchPopupVisible = false;
  myCvs: CV[] = [];
  selectedCvId: number | null = null;
  isMatchLoading = false;
  matchError = '';
private cdr = inject(ChangeDetectorRef);
  ngOnInit() {
    const jobId = Number(this.route.snapshot.paramMap.get('id'));
    forkJoin({
      job: this.jobService.getJobById(jobId),
      skills: this.jobService.getJobSkills(jobId)
    }).subscribe({
      next: ({ job, skills }) => {
        this.job = job;
        this.skills = skills;
        this.isLoading = false;
         this.cdr.detectChanges(); // 🔧
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
        this.cdr.detectChanges(); // 🔧
      }
    });
  }

  openMatchPopup() {
    this.matchError = '';
    this.selectedCvId = null;
    this.isMatchPopupVisible = true;
    this.cvService.getAll(1, 50).subscribe({
      next: (res) => {
        this.myCvs = res.cvs.filter(c => c.status === 'EXTRACTED');
      },
      error: () => {
        this.matchError = 'Impossible de charger vos CVs.';
      }
    });
  }

  selectCv(cvId: number) {
    this.selectedCvId = this.selectedCvId === cvId ? null : cvId;
  }

  confirmMatch() {
    if (!this.selectedCvId || !this.job) return;
    this.isMatchLoading = true;
    this.matchingService.launchMatching(this.selectedCvId, this.job.id).subscribe({
      next: (result) => {
        this.isMatchLoading = false;
        this.isMatchPopupVisible = false;
        this.router.navigate(['/candidate/matchings', result.id]);
      },
      error: (err) => {
        this.isMatchLoading = false;
        this.matchError = err.message;
         this.cdr.detectChanges(); // 🔧
      }
    });
  }

  get popupWidth(): string {
    return window.innerWidth < 640 ? '90%' : '480px';
  }
}
