import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DateService } from '../services';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './date.component.html',
  selector: 'app-date'
})
export class DateComponent {
  public onDateChange(date: string): void {
    this._dateService.setDate(new Date(date));
  }

  public date$: Observable<Date> = this._dateService.date$();

  public constructor(private readonly _dateService: DateService) {}
}
