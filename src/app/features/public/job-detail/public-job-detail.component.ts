import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PublicNavbarComponent } from '../../../shared/components/public-navbar/public-navbar.component';
import { MOCK_JOBS, Job } from '../data/mock-jobs.data';

@Component({
  selector: 'app-public-job-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, PublicNavbarComponent],
  templateUrl: './public-job-detail.component.html',
  styleUrl: './public-job-detail.component.scss'
})
export class PublicJobDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);

  job: Job | null = null;
  similarJobs: Job[] = [];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;
      this.job = MOCK_JOBS.find(j => j.id === id) || null;
      if (!this.job) {
        this.router.navigate(['/jobs']);
        return;
      }
      this.similarJobs = MOCK_JOBS
        .filter(j => j.id !== id && 
          j.skills.some(s => this.job!.skills.includes(s)))
        .slice(0, 3);
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  getTimeAgo(dateString: string): string {
    const diff = Date.now() - new Date(dateString).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Il y a 1 jour';
    return `Il y a ${days} jours`;
  }

  getVisibleSkills(skills: string[]): string[] {
    return skills.slice(0, 3);
  }

  getExtraCount(skills: string[]): number {
    return Math.max(0, skills.length - 3);
  }
}
