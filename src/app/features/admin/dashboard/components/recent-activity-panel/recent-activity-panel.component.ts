import { Component, input } from '@angular/core';

export interface ActivityItem {
  label: string;
  date: string;
}

@Component({
  selector: 'app-recent-activity-panel',
  standalone: true,
  imports: [],
  templateUrl: './recent-activity-panel.component.html',
  styleUrl: './recent-activity-panel.component.scss'
})
export class RecentActivityPanelComponent {
  activities = input<ActivityItem[]>([]);
}
