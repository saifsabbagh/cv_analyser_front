import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  router = inject(Router);

  emailSent = false;
  isLoading = false;

  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.forgotForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.forgotForm.get(fieldName);
    if (!field || !field.errors) return '';
    if (field.errors['required']) return 'Email requis';
    if (field.errors['email']) return 'Email invalide';
    return '';
  }

  onSubmit() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { email } = this.forgotForm.value;
    this.authService.forgotPassword(email!).subscribe({
      next: () => { this.isLoading = false; this.emailSent = true; },
      error: () => { this.isLoading = false; this.emailSent = true; }
    });
  }
}
