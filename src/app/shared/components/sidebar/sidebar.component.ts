import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

export interface SidebarMenuItem {
  label: string;
  route: string;
  icon: string;
}

export interface SidebarCta {
  label: string;
  route: string;
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
  homeRoute = input('/candidate/dashboard');
  settingsRoute = input('/candidate/profile');
  cta = input<SidebarCta | null>({ label: '+ Analyser un CV', route: '/candidate/cv' });
  close = output<void>();

  protected readonly mainMenuItems: SidebarMenuItem[] = [
    { label: 'Dashboard', route: '/candidate/dashboard', icon: 'dashboard' },
    { label: 'Mes CVs', route: '/candidate/cv', icon: 'document' },
    { label: 'Offres', route: '/candidate/jobs', icon: 'briefcase' },
    { label: 'Mes Matchings', route: '/candidate/matchings', icon: 'target' },
    { label: 'Profil', route: '/candidate/profile', icon: 'user' },
  ];

  protected readonly items = computed(() => {
    const provided = this.menuItems();
    return provided.length > 0 ? provided : this.mainMenuItems;
  });

  onClose(): void {
    this.close.emit();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
