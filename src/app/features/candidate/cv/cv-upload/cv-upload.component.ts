import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DxFileUploaderModule } from 'devextreme-angular';
import { CvService } from '../../../../core/services/cv.service';

@Component({
  selector: 'app-cv-upload',
  standalone: true,
  imports: [RouterLink, DxFileUploaderModule],
  templateUrl: './cv-upload.component.html',
  styleUrl: './cv-upload.component.scss'
})
export class CvUploadComponent {
  private cvService = inject(CvService);
  private router = inject(Router);

  uploading = signal(false);
  error = signal<string | null>(null);
  selectedFile = signal<File | null>(null);

  protected readonly maxSizeMB = 10;
  protected readonly accept = '.pdf';

  protected onFileSelected(e: any): void {
    this.error.set(null);
    const files: File[] = e.value;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > this.maxSizeMB * 1024 * 1024) {
        this.error.set(`Le fichier dépasse la taille maximale de ${this.maxSizeMB} Mo.`);
        this.selectedFile.set(null);
        return;
      }
      this.selectedFile.set(file);
    } else {
      this.selectedFile.set(null);
    }
  }

  protected onSubmit(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    this.error.set(null);

    this.cvService.upload(file).subscribe({
      next: (cv) => {
        this.uploading.set(false);
        this.router.navigate(['/candidate/cv', cv.id]);
      },
      error: (err) => {
        this.error.set(err.message);
        this.uploading.set(false);
      }
    });
  }
}
