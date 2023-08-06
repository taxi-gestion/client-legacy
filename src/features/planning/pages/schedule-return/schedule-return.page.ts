import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserPresentation } from '@features/common/user';
import { Observable, Subject } from 'rxjs';
import { SCHEDULE_RETURN_ACTION, ScheduleReturnAction } from '../../providers';
import { SCHEDULE_RETURN_FORM, ScheduleReturnFields, setScheduleReturnErrorToForm } from './schedule-return.form';
import { formatScheduleReturnError, toReturnToSchedule } from './schedule-return.presenter';
import { ActivatedRoute, Params } from '@angular/router';
import { toStandardDateFormat } from '../../common/unit-convertion';
import { Place } from '@domain';
import { PendingPresentation } from '../../common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-schedule-return',
  templateUrl: './schedule-return.page.html'
})
export class ScheduleReturnPage {
  @Output() public scheduleReturnSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleReturnSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public scheduleReturnError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly scheduleReturn$ = (): Observable<object> =>
    this._scheduleReturnAction$(toReturnToSchedule(SCHEDULE_RETURN_FORM.value as PendingPresentation));

  public readonly scheduleReturnForm: FormGroup<ScheduleReturnFields> = SCHEDULE_RETURN_FORM;

  public selectedDate: string = paramsToDateString(this._route);

  public constructor(
    private readonly _route: ActivatedRoute,
    @Inject(SCHEDULE_RETURN_ACTION) private readonly _scheduleReturnAction$: ScheduleReturnAction
  ) {}

  public onSelectDepartureChange(place: Place): void {
    this.scheduleReturnForm.controls.departurePlace.setValue(place);
  }

  public onSelectArrivalChange(place: Place): void {
    this.scheduleReturnForm.controls.arrivalPlace.setValue(place);
  }

  private readonly _departureDisplayLabel$: Subject<string> = new Subject<string>();
  public departureDisplayLabel$: Observable<string> = this._departureDisplayLabel$.asObservable();

  private readonly _destinationDisplayLabel$: Subject<string> = new Subject<string>();
  public destinationDisplayLabel$: Observable<string> = this._destinationDisplayLabel$.asObservable();
  private readonly _driverDisplayLabel$: Subject<string> = new Subject<string>();
  public driverDisplayLabel$: Observable<string> = this._driverDisplayLabel$.asObservable();
  public onSelectPendingReturnChange(pendingReturn: PendingPresentation): void {
    this.scheduleReturnForm.controls.pendingReturnId.setValue(pendingReturn.pendingReturnId);
    this.scheduleReturnForm.controls.departurePlace.setValue(pendingReturn.departurePlace);
    this._departureDisplayLabel$.next(pendingReturn.departurePlace.label);
    this.scheduleReturnForm.controls.arrivalPlace.setValue(pendingReturn.arrivalPlace);
    this._destinationDisplayLabel$.next(pendingReturn.arrivalPlace.label);
    this.scheduleReturnForm.controls.driver.setValue(pendingReturn.driver);
    this._driverDisplayLabel$.next(pendingReturn.driver);
  }

  public onSelectDriverChange(driver: UserPresentation): void {
    this.scheduleReturnForm.controls.driver.setValue(driver.identifier);
  }

  public onSubmitReturnToSchedule = (triggerAction: () => void): void => {
    SCHEDULE_RETURN_FORM.markAllAsTouched();
    SCHEDULE_RETURN_FORM.valid && triggerAction();
  };

  public onScheduleReturnActionSuccess = (): void => {
    SCHEDULE_RETURN_FORM.reset();
  };

  public onScheduleReturnActionError = (error: Error): void => {
    setScheduleReturnErrorToForm(formatScheduleReturnError(error));
  };
}

const paramsToDateString = (params: Params): string =>
  params['date'] == null ? toStandardDateFormat(new Date()) : (params['date'] as string);
