import { Component, input } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';

export interface TableColumn {
  dataField: string;
  caption: string;
  [key: string]: any;
}

@Component({
  selector: 'app-data-table-widget',
  standalone: true,
  imports: [DxDataGridModule],
  templateUrl: './data-table-widget.component.html',
  styleUrl: './data-table-widget.component.scss'
})
export class DataTableWidgetComponent {
  data = input.required<any[]>();
  columns = input.required<TableColumn[]>();
  title = input<string>();
  loading = input(false);
  emptyMessage = input('Aucune donnée disponible');
  maxRows = input(5);
}
