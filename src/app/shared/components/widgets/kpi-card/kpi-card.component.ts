import { Component, input, computed } from '@angular/core';

export type AccentColor = 'primary' | 'success' | 'warning' | 'info';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [],
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss'
})
export class KpiCardComponent {
  icon = input.required<string>();
  label = input.required<string>();
  value = input.required<string | number>();
  variation = input<number>();
  accentColor = input<AccentColor>('primary');
  loading = input(false);

  protected variationClass = computed(() => {
    const v = this.variation();
    if (v === undefined || v === null) return '';
    return v >= 0 ? 'variation-positive' : 'variation-negative';
  });

  protected variationArrow = computed(() => {
    const v = this.variation();
    if (v === undefined || v === null) return '';
    return v >= 0 ? '↑' : '↓';
  });

  protected variationValue = computed(() => {
    const v = this.variation();
    if (v === undefined || v === null) return '';
    return `${Math.abs(v)}%`;
  });

  protected circleClass = computed(() => `kpi-circle kpi-circle--${this.accentColor()}`);
}
