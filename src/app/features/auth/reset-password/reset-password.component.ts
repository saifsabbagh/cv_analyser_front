import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  state: 'form' | 'success' | 'invalid-token' = 'form';
  token: string | null = null;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  resetForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
      if (!this.token) {
        this.state = 'invalid-token';
      }
    });
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  getPasswordStrength(): number {
    const pwd = this.resetForm.get('password')?.value || '';
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  }

  getStrengthLabel(): string {
    const labels = ['Faible', 'Faible', 'Moyen', 'Bon', 'Excellent'];
    return labels[this.getPasswordStrength()];
  }

  getStrengthColor(index: number): string {
    const score = this.getPasswordStrength();
    if (index >= score) return 'bg-slate-700';
    if (score <= 1) return 'bg-red-500';
    if (score === 2) return 'bg-orange-500';
    if (score === 3) return 'bg-yellow-500';
    return 'bg-emerald-500';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.resetForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.resetForm.get(fieldName);
    if (!field || !field.errors) return '';
    if (field.errors['required']) {
      const labels: Record<string, string> = {
        password: 'Mot de passe requis',
        confirmPassword: 'Confirmation requise'
      };
      return labels[fieldName] ?? 'Champ requis';
    }
    if (field.errors['minlength']) {
      const min = field.errors['minlength'].requiredLength;
      return `Minimum ${min} caractères requis`;
    }
    return '';
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    const { password } = this.resetForm.value;
    this.authService.resetPassword(this.token!, password!).subscribe({
      next: () => {
        this.isLoading = false;
        this.state = 'success';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Une erreur est survenue lors de la réinitialisation.';
      }
    });
  }
}
