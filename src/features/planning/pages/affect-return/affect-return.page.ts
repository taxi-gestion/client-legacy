import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserPresentation } from '@features/common/user';
import { Observable, Subject } from 'rxjs';
import { AFFECT_RETURN_ACTION, AffectReturnAction } from '../../providers';
import { AFFECT_RETURN_FORM, AffectReturnFields, setAffectReturnErrorToForm } from './affect-return.form';
import { formatAffectReturnError, toReturnToAffectToScheduled } from './affect-return.presenter';
import { ActivatedRoute, Params } from '@angular/router';
import { toStandardDateFormat } from '../../common/unit-convertion';
import { Place } from '@domain';
import { ReturnToAffectPresentation } from '../../common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-affect-return',
  templateUrl: './affect-return.page.html'
})
export class AffectReturnPage {
  @Output() public affectReturnSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public affectReturnSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public affectReturnError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly affectReturn$ = (): Observable<object> =>
    this._affectReturnAction$(toReturnToAffectToScheduled(AFFECT_RETURN_FORM.value as ReturnToAffectPresentation));

  public readonly affectReturnForm: FormGroup<AffectReturnFields> = AFFECT_RETURN_FORM;

  public selectedDate: string = paramsToDateString(this._route);

  public constructor(
    private readonly _route: ActivatedRoute,
    @Inject(AFFECT_RETURN_ACTION) private readonly _affectReturnAction$: AffectReturnAction
  ) {}

  public onSelectDepartureChange(place: Place): void {
    this.affectReturnForm.controls.departurePlace.setValue(place);
  }

  public onSelectArrivalChange(place: Place): void {
    this.affectReturnForm.controls.arrivalPlace.setValue(place);
  }

  private readonly _departureDisplayLabel$: Subject<string> = new Subject<string>();
  public departureDisplayLabel$: Observable<string> = this._departureDisplayLabel$.asObservable();

  private readonly _destinationDisplayLabel$: Subject<string> = new Subject<string>();
  public destinationDisplayLabel$: Observable<string> = this._destinationDisplayLabel$.asObservable();
  private readonly _driverDisplayLabel$: Subject<string> = new Subject<string>();
  public driverDisplayLabel$: Observable<string> = this._driverDisplayLabel$.asObservable();
  public onSelectReturnToAffectChange(returnToAffect: ReturnToAffectPresentation): void {
    this.affectReturnForm.controls.returnToAffectId.setValue(returnToAffect.returnToAffectId);
    this.affectReturnForm.controls.departurePlace.setValue(returnToAffect.departurePlace);
    this._departureDisplayLabel$.next(returnToAffect.departurePlace.label);
    this.affectReturnForm.controls.arrivalPlace.setValue(returnToAffect.arrivalPlace);
    this._destinationDisplayLabel$.next(returnToAffect.arrivalPlace.label);
    this.affectReturnForm.controls.driver.setValue(returnToAffect.driver);
    this._driverDisplayLabel$.next(returnToAffect.driver);
  }

  public onSelectDriverChange(driver: UserPresentation): void {
    this.affectReturnForm.controls.driver.setValue(driver.identifier);
  }

  public onSubmitReturnToAffect = (triggerAction: () => void): void => {
    AFFECT_RETURN_FORM.markAllAsTouched();
    AFFECT_RETURN_FORM.valid && triggerAction();
  };

  public onAffectReturnActionSuccess = (): void => {
    AFFECT_RETURN_FORM.reset();
  };

  public onAffectReturnActionError = (error: Error): void => {
    setAffectReturnErrorToForm(formatAffectReturnError(error));
  };
}

const paramsToDateString = (params: Params): string =>
  params['date'] == null ? toStandardDateFormat(new Date()) : (params['date'] as string);
