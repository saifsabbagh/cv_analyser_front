// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   FormBuilder,
//   ReactiveFormsModule,
//   Validators
// } from '@angular/forms';
// import {
//   ActivatedRoute,
//   Router,
//   RouterLink
// } from '@angular/router';

// import { AuthService } from '../../../core/services/auth.service';

// // DevExtreme Components
// import { DxTextBoxComponent } from 'devextreme-angular/ui/text-box';
// import { DxCheckBoxComponent } from 'devextreme-angular/ui/check-box';
// import { DxButtonComponent } from 'devextreme-angular/ui/button';
// import { DxLoadIndicatorComponent } from 'devextreme-angular/ui/load-indicator';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     RouterLink,

//     DxTextBoxComponent,
//     DxCheckBoxComponent,
//     DxButtonComponent,
//     DxLoadIndicatorComponent
//   ],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss'
// })
// export class LoginComponent implements OnInit {

//   private fb = inject(FormBuilder);
//   private authService = inject(AuthService);
//   private router = inject(Router);
//   private route = inject(ActivatedRoute);

//   isLoading = false;
//   errorMessage = '';
//   successMessage = '';

//   loginForm = this.fb.group({
//     email: ['', [Validators.required, Validators.email]],
//     password: ['', Validators.required],
//     rememberMe: [false]
//   });

//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       if (params['registered'] === 'true') {
//         this.successMessage =
//           'Compte créé avec succès ! Connectez-vous.';
//       }
//     });
//   }

//   onSubmit(): void {

//     if (this.loginForm.invalid) {
//       this.loginForm.markAllAsTouched();
//       return;
//     }

//     this.isLoading = true;
//     this.errorMessage = '';

//     const { email, password } = this.loginForm.getRawValue();

//     this.authService.login(email!, password!).subscribe({

//       next: (user) => {

//         this.isLoading = false;

//         switch (user.role) {

//           case 'CANDIDATE':
//             this.router.navigate(['/candidate/dashboard']);
//             break;

//           case 'ADMIN':
//             this.router.navigate(['/admin/dashboard']);
//             break;

//           default:
//             this.router.navigate(['/']);
//             break;
//         }

//       },

//       error: (err) => {

//         this.isLoading = false;

//         this.errorMessage =
//           err?.message ??
//           'Une erreur est survenue lors de la connexion.';

//       }

//     });

//   }

//   isFieldInvalid(fieldName: string): boolean {

//     const field = this.loginForm.get(fieldName);

//     return !!(
//       field &&
//       field.invalid &&
//       (field.dirty || field.touched)
//     );

//   }

//   getFieldError(fieldName: string): string {

//     const field = this.loginForm.get(fieldName);

//     if (!field?.errors) {
//       return '';
//     }

//     if (field.errors['required']) {

//       return fieldName === 'email'
//         ? 'Email requis'
//         : 'Mot de passe requis';

//     }

//     if (field.errors['email']) {
//       return 'Adresse email invalide';
//     }

//     return '';

//   }

// }
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

// DevExtreme Components
import { DxTextBoxComponent } from 'devextreme-angular/ui/text-box';
import { DxCheckBoxComponent } from 'devextreme-angular/ui/check-box';
import { DxButtonComponent } from 'devextreme-angular/ui/button';
import { DxTemplateModule } from 'devextreme-angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,

    DxTextBoxComponent,
    DxCheckBoxComponent,
    DxButtonComponent,
    DxTemplateModule
  ],
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
    password: ['', Validators.required],
    rememberMe: [false]
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.successMessage =
          'Compte créé avec succès ! Connectez-vous.';
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login(email!, password!).subscribe({

      next: (user) => {

        this.isLoading = false;

        switch (user.role) {

          case 'CANDIDATE':
            this.router.navigate(['/candidate/dashboard']);
            break;

          case 'ADMIN':
            this.router.navigate(['/admin/dashboard']);
            break;

          default:
            this.router.navigate(['/']);
            break;
        }

      },

      error: (err) => {

        this.isLoading = false;

        this.errorMessage =
          err?.message ??
          'Une erreur est survenue lors de la connexion.';

      }

    });

  }

  isFieldInvalid(fieldName: string): boolean {

    const field = this.loginForm.get(fieldName);

    return !!(
      field &&
      field.invalid &&
      (field.dirty || field.touched)
    );

  }

  getFieldError(fieldName: string): string {

    const field = this.loginForm.get(fieldName);

    if (!field?.errors) {
      return '';
    }

    if (field.errors['required']) {

      return fieldName === 'email'
        ? 'Email requis'
        : 'Mot de passe requis';

    }

    if (field.errors['email']) {
      return 'Adresse email invalide';
    }

    return '';

  }

}