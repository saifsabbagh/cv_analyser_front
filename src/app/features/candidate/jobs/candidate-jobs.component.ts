// import { Component, inject, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterLink } from '@angular/router';
// import { ReactiveFormsModule, FormControl } from '@angular/forms';
// import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
// import { JobService } from '../../../core/services/job.service';
// import { Job } from '../../../core/models/job.model';

// @Component({
//   selector: 'app-candidate-jobs',
//   standalone: true,
//   imports: [CommonModule, RouterLink, ReactiveFormsModule],
//   templateUrl: './candidate-jobs.component.html',
//   styleUrls: ['./candidate-jobs.component.scss']
// })
// export class CandidateJobsComponent implements OnInit, OnDestroy {
//   private jobService = inject(JobService);
//   private destroy$ = new Subject<void>();

//   jobs: Job[] = [];
//   isLoading = false;
//   errorMessage = '';
//   currentPage = 1;
//   totalPages = 1;
//   searchControl = new FormControl('');

//   ngOnInit() {
//     this.loadJobs();
//     this.searchControl.valueChanges.pipe(
//       debounceTime(400),
//       distinctUntilChanged(),
//       takeUntil(this.destroy$)
//     ).subscribe(() => {
//       this.currentPage = 1;
//       this.loadJobs();
//     });
//   }

//   ngOnDestroy() {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }
// private cdr = inject(ChangeDetectorRef);
//   loadJobs() {
//     this.isLoading = true;
//     this.errorMessage = '';
//     this.jobService.getAll({ search: this.searchControl.value ?? '', page: this.currentPage, limit: 9 }).subscribe({
//       next: (res) => {
//         console.log('Inside Angular zone?', NgZone.isInAngularZone());
//         this.jobs = res.jobs;
//         this.totalPages = res.totalPages ?? 1;
//         this.isLoading = false;
//        this.cdr.detectChanges(); // 🔧 force update  
//       },
//       error: (err) => {
//         this.errorMessage = err.message;
//         this.isLoading = false;
//         this.cdr.detectChanges(); // 🔧 force update
//       }
//     });
//   }

//   nextPage() {
//     if (this.currentPage < this.totalPages) {
//       this.currentPage++;
//       this.loadJobs();
//     }
//   }

//   prevPage() {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//       this.loadJobs();
//     }
//   }

//   getSkeletonArray(): number[] {
//     return Array(6).fill(0);
//   }

//   getExcerpt(description: string, maxLength = 120): string {
//     if (!description) return '';
//     return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
//   }
// }


import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-candidate-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './candidate-jobs.component.html',
  styleUrls: ['./candidate-jobs.component.scss']
})
export class CandidateJobsComponent implements OnInit, OnDestroy {
  private jobService = inject(JobService);
  private destroy$ = new Subject<void>();

  // Signals badal plain properties — reactivity independante 3an Zone.js
  jobs = signal<Job[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  currentPage = signal(1);
  totalPages = signal(1);

  searchControl = new FormControl('');

  ngOnInit() {
    this.loadJobs();
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage.set(1);
      this.loadJobs();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadJobs() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.jobService.getAll({
      search: this.searchControl.value ?? '',
      page: this.currentPage(),
      limit: 9
    }).subscribe({
      next: (res) => {
        this.jobs.set(res.jobs);
        this.totalPages.set(res.totalPages ?? 1);
        this.isLoading.set(false);
        // Plus besoin de cdr.detectChanges() — .set() notifie le template directement,
        // indépendamment du contexte Zone dans lequel le callback s'exécute.
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadJobs();
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadJobs();
    }
  }

  getSkeletonArray(): number[] {
    return Array(6).fill(0);
  }

  getExcerpt(description: string, maxLength = 120): string {
    if (!description) return '';
    return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
  }
}