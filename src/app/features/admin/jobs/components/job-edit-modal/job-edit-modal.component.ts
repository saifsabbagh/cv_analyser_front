import { Component, OnInit, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DxPopupModule, DxTagBoxModule } from 'devextreme-angular';
import { Job, JobPayload } from '../../../../../core/models/job.model';
import { SkillService } from '../../../../../core/services/skill.service';
import { JobService } from '../../../../../core/services/job.service';

export interface JobFormSubmit {
  payload: JobPayload;
  skillNames: string[];
}

@Component({
  selector: 'app-job-edit-modal',
  standalone: true,
  imports: [ReactiveFormsModule, DxPopupModule, DxTagBoxModule],
  templateUrl: './job-edit-modal.component.html',
  styleUrl: './job-edit-modal.component.scss'
})
export class JobEditModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private skillService = inject(SkillService);
  private jobService = inject(JobService);

  visible = input(false);
  saving = input(false);
  /** null = mode création, Job = mode édition */
  job = input<Job | null>(null);

  saved = output<JobFormSubmit>();
  closed = output<void>();

  protected skillNames = signal<string[]>([]);
  protected selectedSkills = signal<string[]>([]);
  protected skillsLoading = signal(false);

  protected form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.required]],
    location: [''],
    isActive: [true]
  });

  constructor() {
    effect(() => {
      if (!this.visible()) {
        this.form.reset({ title: '', description: '', location: '', isActive: true });
        this.selectedSkills.set([]);
        return;
      }

      const current = this.job();
      if (current) {
        this.form.patchValue({
          title: current.title,
          description: current.description,
          location: current.location ?? '',
          isActive: current.isActive
        });
        this.loadJobSkills(current.id);
      } else {
        this.form.reset({ title: '', description: '', location: '', isActive: true });
        this.selectedSkills.set([]);
      }
    });
  }

  ngOnInit(): void {
    this.loadSkillCatalog();
  }

  protected get isEditMode(): boolean {
    return this.job() !== null;
  }

  protected get modalTitle(): string {
    return this.isEditMode ? 'Modifier l\'offre' : 'Nouvelle offre';
  }

  protected onSkillsChanged(names: string[]): void {
    this.selectedSkills.set(names ?? []);
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.selectedSkills().length === 0) {
      return;
    }

    const raw = this.form.getRawValue();
    this.saved.emit({
      payload: {
        title: raw.title.trim(),
        description: raw.description.trim(),
        location: raw.location.trim() || null,
        isActive: raw.isActive
      },
      skillNames: this.selectedSkills()
    });
  }

  protected onCancel(): void {
    this.closed.emit();
  }

  protected onVisibleChange(isVisible: boolean): void {
    if (!isVisible) this.closed.emit();
  }

  protected isFieldInvalid(name: 'title' | 'description'): boolean {
    const field = this.form.controls[name];
    return field.invalid && field.touched;
  }

  protected get skillsMissing(): boolean {
    return this.form.touched && this.selectedSkills().length === 0;
  }

  private loadSkillCatalog(): void {
    this.skillsLoading.set(true);
    this.skillService.getAll({ page: 1, limit: 1000 }).subscribe({
      next: (res) => {
        this.skillNames.set(res.skills.map(s => s.name));
        this.skillsLoading.set(false);
      },
      error: () => this.skillsLoading.set(false)
    });
  }

  private loadJobSkills(jobId: number): void {
    this.jobService.getJobSkills(jobId).subscribe({
      next: (skills) => this.selectedSkills.set(skills.map(s => s.name)),
      error: () => this.selectedSkills.set([])
    });
  }
}
