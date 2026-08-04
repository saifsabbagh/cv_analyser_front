import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent, SidebarMenuItem } from '../../../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../shared/components/topbar/topbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  protected sidebarOpen = signal(false);

  protected readonly adminMenuItems: SidebarMenuItem[] = [
    { label: 'Tableau de bord', route: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Utilisateurs', route: '/admin/users', icon: 'users' },
    { label: 'Offres', route: '/admin/jobs', icon: 'briefcase' },
    { label: 'Compétences', route: '/admin/skills', icon: 'skills' },
    { label: 'Matchings', route: '/admin/matches', icon: 'target' },
  ];

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
