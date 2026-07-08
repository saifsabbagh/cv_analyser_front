import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './public-navbar.component.html',
  styleUrl: './public-navbar.component.scss'
})
export class PublicNavbarComponent {
  router = inject(Router);
  scrolled = false;
  menuOpen = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  scrollToSection(sectionId: string) {
    this.menuOpen = false;
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      });
    }
  }
}
