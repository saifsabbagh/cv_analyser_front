import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.successMessage = 'Compte créé avec succès ! Connectez-vous.';
      }
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (user.role === 'CANDIDATE') {
          this.router.navigate(['/candidate/dashboard']);
        } else if (user.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Une erreur est survenue lors de la connexion.';
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors) return '';
    if (field.errors['required']) {
      return fieldName === 'email' ? 'Email requis' : 'Mot de passe requis';
    }
    if (field.errors['email']) {
      return 'Email invalide';
    }
    return '';
  }
}
