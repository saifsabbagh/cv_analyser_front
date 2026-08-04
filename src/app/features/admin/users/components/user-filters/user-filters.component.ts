import { Component, DestroyRef, OnInit, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserFilters } from '../../../../../core/models/admin.model';

@Component({
  selector: 'app-user-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-filters.component.html',
  styleUrl: './user-filters.component.scss'
})
export class UserFiltersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  filtersChange = output<UserFilters>();

  protected form = this.fb.nonNullable.group({
    search: '',
    role: '',
    isActive: ''
  });

  ngOnInit(): void {
    this.form.controls.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitFilters());

    this.form.controls.role.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitFilters());

    this.form.controls.isActive.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitFilters());
  }

  protected resetFilters(): void {
    this.form.reset({ search: '', role: '', isActive: '' }, { emitEvent: false });
    this.emitFilters();
  }

  private emitFilters(): void {
    const { search, role, isActive } = this.form.getRawValue();
    const filters: UserFilters = {};

    if (search.trim()) filters.search = search.trim();
    if (role) filters.role = role as 'ADMIN' | 'CANDIDATE';
    if (isActive) filters.isActive = isActive === 'true';

    this.filtersChange.emit(filters);
  }
}
