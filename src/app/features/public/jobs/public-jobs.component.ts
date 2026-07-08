import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PublicNavbarComponent } from '../../../shared/components/public-navbar/public-navbar.component';
import { MOCK_JOBS, Job } from '../data/mock-jobs.data';

@Component({
  selector: 'app-public-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PublicNavbarComponent],
  templateUrl: './public-jobs.component.html',
  styleUrl: './public-jobs.component.scss'
})
export class PublicJobsComponent implements OnInit {
  router = inject(Router);

  jobs = MOCK_JOBS;
  filteredJobs: Job[] = [];
  paginatedJobs: Job[] = [];
  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  ngOnInit() {
    this.applyFilter();
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilter();
  }

  applyFilter() {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredJobs = q
      ? this.jobs.filter(j =>
          j.title.toLowerCase().includes(q) ||
          j.skills.some(s => s.toLowerCase().includes(q)) ||
          j.location.toLowerCase().includes(q))
      : [...this.jobs];
    this.totalPages = Math.ceil(this.filteredJobs.length / this.itemsPerPage);
    this.updatePage();
  }

  updatePage() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedJobs = this.filteredJobs.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePage();
  }

  resetSearch() {
    this.searchQuery = '';
    this.onSearch();
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

  getPagesArray(): number[] {
    const arr = [];
    for (let i = 1; i <= this.totalPages; i++) {
      arr.push(i);
    }
    return arr;
  }
}
