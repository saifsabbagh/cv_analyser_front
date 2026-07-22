import { Component, inject, input, output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [AsyncPipe, ThemeToggleComponent],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  private authService = inject(AuthService);

  pageTitle = input<string>();
  menuToggle = output<void>();

  protected currentUser$ = this.authService.currentUser$;

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  getUserRoleLabel(role: 'CANDIDATE' | 'ADMIN' | undefined): string {
    switch (role) {
      case 'CANDIDATE': return 'Candidat';
      case 'ADMIN': return 'Administrateur';
      default: return '';
    }
  }

  getUserInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
