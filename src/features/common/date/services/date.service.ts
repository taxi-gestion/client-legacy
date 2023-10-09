import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private readonly _date: BehaviorSubject<Date> = new BehaviorSubject(new Date());

  public setDate(date: Date): void {
    this._date.next(date);
  }

  public date$(): Observable<Date> {
    return this._date.asObservable();
  }

  public date(): Date {
    return this._date.getValue();
  }
}
