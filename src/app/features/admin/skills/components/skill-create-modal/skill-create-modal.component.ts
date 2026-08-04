import { Component, effect, inject, output, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DxPopupModule } from 'devextreme-angular';

@Component({
  selector: 'app-skill-create-modal',
  standalone: true,
  imports: [ReactiveFormsModule, DxPopupModule],
  templateUrl: './skill-create-modal.component.html',
  styleUrl: './skill-create-modal.component.scss'
})
export class SkillCreateModalComponent {
  private fb = inject(FormBuilder);

  visible = input(false);
  saving = input(false);

  created = output<string>();
  closed = output<void>();

  protected form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]]
  });

  constructor() {
    effect(() => {
      if (!this.visible()) {
        this.form.reset({ name: '' });
      }
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.created.emit(this.form.getRawValue().name.trim());
  }

  protected onCancel(): void {
    this.closed.emit();
  }

  protected onVisibleChange(isVisible: boolean): void {
    if (!isVisible) {
      this.closed.emit();
    }
  }

  protected get isNameInvalid(): boolean {
    const control = this.form.controls.name;
    return control.invalid && control.touched;
  }
}
