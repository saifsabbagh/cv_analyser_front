import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CV } from '../../../../../core/models/cv.model';
import { getStatusLabel, getStatusBadgeClass } from '../../../../../shared/utils/cv.utils';

@Component({
  selector: 'app-cv-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cv-card.component.html',
  styleUrl: './cv-card.component.scss'
})
export class CvCardComponent {
  cv = input.required<CV>();
  deleteRequested = output<number>();

  protected menuOpen = false;

  protected getStatusLabel = getStatusLabel;
  protected getStatusBadgeClass = getStatusBadgeClass;

  protected formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  protected toggleMenu(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.menuOpen = !this.menuOpen;
  }

  protected onDelete(): void {
    this.menuOpen = false;
    this.deleteRequested.emit(this.cv().id);
  }
}
