export type CVStatus = 'PENDING' | 'EXTRACTED' | 'FAILED';

export function getStatusLabel(status: CVStatus): string {
  switch (status) {
    case 'EXTRACTED': return 'Analysé';
    case 'PENDING': return 'En cours';
    case 'FAILED': return 'Échec';
  }
}

export function getStatusBadgeClass(status: CVStatus): string {
  switch (status) {
    case 'EXTRACTED': return 'badge-success';
    case 'PENDING': return 'badge-warning';
    case 'FAILED': return 'badge-danger';
  }
}

export function getStatusColor(status: CVStatus): string {
  switch (status) {
    case 'EXTRACTED': return 'var(--color-success)';
    case 'PENDING': return 'var(--color-warning)';
    case 'FAILED': return 'var(--color-error)';
  }
}
