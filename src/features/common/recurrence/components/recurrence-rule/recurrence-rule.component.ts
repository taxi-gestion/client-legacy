/* eslint-disable */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RRule } from 'rrule';
import { addYears, format } from 'date-fns';

type RRuleDay = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';

@Component({
  selector: 'app-recurrence-rule',
  templateUrl: './recurrence-rule.component.html'
})
export class RecurrenceRuleComponent implements OnInit {
  @Input() public occurenceNumber: number = 5;
  @Output() public readonly selectedValue: EventEmitter<{ rule: string; occurrences: Date[] }> = new EventEmitter<{
    rule: string;
    occurrences: Date[];
  }>();

  public form: FormGroup;

  public daysOfWeek: Array<{ label: string; value: RRuleDay }> = [
    { label: 'Lundi', value: 'MO' },
    { label: 'Mardi', value: 'TU' },
    { label: 'Mercredi', value: 'WE' },
    { label: 'Jeudi', value: 'TH' },
    { label: 'Vendredi', value: 'FR' },
    { label: 'Samedi', value: 'SA' },
    { label: 'Dimanche', value: 'SU' }
  ];

  public periodicities: { label: string; value: string }[] = [
    { label: 'Chaque semaine', value: '1' },
    { label: 'Toutes les 2 semaines', value: '2' },
    { label: 'Toutes les 3 semaines', value: '3' },
    { label: 'Toutes les 4 semaines', value: '4' }
  ];

  public startDate: Date = new Date();

  private readonly fb: FormBuilder = new FormBuilder();

  public constructor() {
    this.form = this.fb.group({
      dayOfWeek: [[]],
      periodicity: ['1'],
      startDate: format(this.startDate, 'yyyy-MM-dd')
    });
  }

  public ngOnInit(): void {
    this.form.valueChanges.subscribe((values): void => {
      this.generateRRule(values);
    });
    this.generateRRule(this.form.value);
  }

  public onDayOfWeekChanged(dayValue: string, element: EventTarget | null): void {
    const dayOfWeekControl = this.form.get('dayOfWeek')!;

    if ((element as HTMLInputElement).checked) {
      // If the checkbox is checked, add the value to the array
      const selectedDays = [...dayOfWeekControl.value, dayValue];
      dayOfWeekControl.setValue(selectedDays);
    } else {
      // If the checkbox is unchecked, remove the value from the array
      const updatedDays = dayOfWeekControl.value.filter((day: string): boolean => day !== dayValue);
      dayOfWeekControl.setValue(updatedDays);
    }
  }

  public generateRRule(values: any): void {
    const { dayOfWeek, periodicity, startDate } = values;

    if (dayOfWeek.length > 0 && periodicity && startDate) {
      const start: Date = new Date(startDate);
      const byweekday = dayOfWeek.map((day: string) => RRule[day as RRuleDay]);

      const rrule: RRule = new RRule({
        freq: RRule.WEEKLY,
        interval: parseInt(periodicity, 10),
        byweekday: byweekday,
        dtstart: start
      });

      this.selectedValue.emit({
        rule: rrule.toString(),
        occurrences: rrule.between(start, addYears(start, 1)).slice(0, this.occurenceNumber)
      });
    }
  }
}
