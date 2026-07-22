import { Component, input } from '@angular/core';
import { DxPieChartModule } from 'devextreme-angular';

@Component({
  selector: 'app-donut-chart-widget',
  standalone: true,
  imports: [DxPieChartModule],
  templateUrl: './donut-chart-widget.component.html',
  styleUrl: './donut-chart-widget.component.scss'
})
export class DonutChartWidgetComponent {
  data = input.required<any[]>();
  argumentField = input.required<string>();
  valueField = input.required<string>();
  title = input<string>();
  colors = input<string[]>();
  loading = input(false);
  emptyMessage = input('Aucune donnée disponible');

  // Colors resolved via CSS overrides in SCSS for theme-aware rendering
}
