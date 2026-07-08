import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  getPasswordStrength(): number {
    const pwd = this.registerForm.get('password')?.value || '';
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
    const field = this.registerForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field || !field.errors) return '';
    if (field.errors['required']) {
      const labels: Record<string, string> = {
        name: 'Nom requis',
        email: 'Email requis',
        password: 'Mot de passe requis',
        confirmPassword: 'Confirmation requise'
      };
      return labels[fieldName] ?? 'Champ requis';
    }
    if (field.errors['email']) return 'Email invalide';
    if (field.errors['minlength']) {
      const min = field.errors['minlength'].requiredLength;
      return fieldName === 'name'
        ? `Minimum ${min} caractères`
        : `Minimum ${min} caractères requis`;
    }
    return '';
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    const { name, email, password } = this.registerForm.value;
    this.authService.register(name!, email!, password!).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message;
      }
    });
  }
}
