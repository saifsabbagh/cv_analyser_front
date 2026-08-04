import { Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Job } from '../../../../../core/models/job.model';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.scss'
})
export class JobCardComponent {
  job = input.required<Job>();

  edit = output<Job>();
  remove = output<Job>();
  view = output<Job>();

  protected skills = computed(() => this.job().skills ?? []);
  protected visibleSkills = computed(() => this.skills().slice(0, 4));
  protected extraSkillsCount = computed(() => Math.max(this.skills().length - 4, 0));
  protected matchedCount = computed(() => this.job().matchedCandidatesCount ?? 0);
}
