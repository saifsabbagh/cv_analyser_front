import { Component, input } from '@angular/core';
import { DxChartModule } from 'devextreme-angular';

@Component({
  selector: 'app-bar-chart-widget',
  standalone: true,
  imports: [DxChartModule],
  templateUrl: './bar-chart-widget.component.html',
  styleUrl: './bar-chart-widget.component.scss'
})
export class BarChartWidgetComponent {
  data = input.required<any[]>();
  argumentField = input.required<string>();
  valueField = input.required<string>();
  title = input<string>();
  loading = input(false);
  emptyMessage = input('Aucune donnée disponible');
}
