import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  user = signal<User | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');
  isEditingName = signal(false);
  nameInput = signal('');
  selectedAvatarFile = signal<File | null>(null);
  avatarPreviewUrl = signal<string | null>(null);
  isSaving = signal(false);
  saveError = signal('');

  ngOnInit() {
    this.authService.currentUser$.subscribe({
      next: (u) => {
        if (u) {
          this.user.set(u);
          this.isLoading.set(false);
        } else {
          this.authService.getMe().subscribe({
            next: (fetched) => {
              this.user.set(fetched);
              this.isLoading.set(false);
            },
            error: (err) => {
              this.errorMessage.set(err.message);
              this.isLoading.set(false);
            }
          });
        }
      }
    });
  }

  startEditName() {
    this.nameInput.set(this.user()?.name ?? '');
    this.isEditingName.set(true);
  }

  cancelEditName() {
    this.isEditingName.set(false);
    this.saveError.set('');
  }

  onAvatarFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.saveError.set('Format non supporté. Utilisez JPG, PNG ou WEBP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.saveError.set('L\'image ne doit pas dépasser 2 Mo.');
      return;
    }

    this.saveError.set('');
    this.selectedAvatarFile.set(file);
    this.avatarPreviewUrl.set(URL.createObjectURL(file));
  }

  saveProfile() {
    const name = this.isEditingName() ? this.nameInput().trim() : undefined;
    const avatarFile = this.selectedAvatarFile() ?? undefined;

    if (!name && !avatarFile) {
      this.isEditingName.set(false);
      return;
    }

    this.isSaving.set(true);
    this.saveError.set('');

    this.userService.updateProfile(name, avatarFile).subscribe({
      next: (updatedUser) => {
        this.user.set(updatedUser);
        this.isEditingName.set(false);
        this.selectedAvatarFile.set(null);
        if (this.avatarPreviewUrl()) {
          URL.revokeObjectURL(this.avatarPreviewUrl()!);
          this.avatarPreviewUrl.set(null);
        }
        this.isSaving.set(false);
      },
      error: (err) => {
        this.saveError.set(err.message);
        this.isSaving.set(false);
      }
    });
  }

  ngOnDestroy() {
    if (this.avatarPreviewUrl()) {
      URL.revokeObjectURL(this.avatarPreviewUrl()!);
    }
  }

  getInitials(): string {
    const name = this.user()?.name;
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  getRoleLabel(): string {
    const role = this.user()?.role;
    return role === 'CANDIDATE' ? 'Candidat' : role === 'ADMIN' ? 'Administrateur' : '—';
  }

  onLogout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      this.authService.logout();
    }
  }
}
