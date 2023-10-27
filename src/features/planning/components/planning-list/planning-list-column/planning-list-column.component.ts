import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FareListItem } from '../../../layouts/daily-planning-list/daily-planning-list.presenter';
import { DateService } from '../../../../common/date';
import { map, Observable } from 'rxjs';
import { toStandardDateFormat } from '../../../../common/angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-planning-list-column',
  templateUrl: './planning-list-column.component.html'
})
export class PlanningListColumnComponent {
  @Input({ required: true }) public driver!: string;

  @Input({ required: true }) public fares!: FareListItem[];

  public selectedDate$: Observable<string> = this._date.date$().pipe(map(toStandardDateFormat));

  public constructor(private readonly _date: DateService) {}
}
