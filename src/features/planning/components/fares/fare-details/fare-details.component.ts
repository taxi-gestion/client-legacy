import { Component, Input } from '@angular/core';
import { FareForDate } from '../../../providers';

@Component({
  selector: 'app-fare-details',
  templateUrl: './fare-details.component.html',
  styleUrls: ['./fare-details.component.scss']
})
export class FareDetailsComponent {
  @Input({ required: true }) public fare!: FareForDate;

  public getKindBadgeClass(kind: string): string {
    switch (kind) {
      case 'go-back':
        return 'badge rounded-pill text-bg-primary';
      case 'one-way':
        return 'badge rounded-pill text-bg-secondary';
      case 'outward':
        return 'badge rounded-pill text-bg-success';
      default:
        return 'badge';
    }
  }

  public getNatureBadgeClass(nature: string): string {
    switch (nature) {
      case 'medical':
        return 'badge rounded-pill text-bg-success';
      case 'standard':
        return 'badge rounded-pill text-bg-secondary';
      default:
        return 'badge';
    }
  }

  public getStatusBadgeClass(fareStatus: string): string {
    switch (fareStatus) {
      case 'scheduled':
        return 'badge rounded-pill text-bg-info';
      case 'in-progress':
        return 'badge rounded-pill text-bg-warning';
      case 'finished':
        return 'badge rounded-pill text-bg-primary';
      default:
        return 'badge';
    }
  }
}
