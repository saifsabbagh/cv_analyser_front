import { Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

export interface SidebarMenuItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ThemeToggleComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private authService = inject(AuthService);

  menuItems = input<SidebarMenuItem[]>([]);
  isOpen = input(false);
  close = output<void>();

  protected readonly mainMenuItems: SidebarMenuItem[] = [
    { label: 'Dashboard', route: '/candidate/dashboard', icon: 'dashboard' },
    { label: 'Mes CVs', route: '/candidate/cv', icon: 'document' },
    { label: 'Offres', route: '/candidate/jobs', icon: 'briefcase' },
    { label: 'Mes Matchings', route: '/candidate/matchings', icon: 'target' },
    { label: 'Profil', route: '/candidate/profile', icon: 'user' },
  ];

  onClose(): void {
    this.close.emit();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
