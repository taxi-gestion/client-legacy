import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PlacePresentation } from '@features/common/place';
import { UserPresentation } from '@features/common/user';
import { Observable, Subject } from 'rxjs';
import { ReturnToAffectForDatePresentation } from '../../common/returns-to-affect.presentation';
import { AFFECT_RETURN_ACTION, AffectReturnAction, ReturnToAffectTransfer } from '../../providers';
import { AFFECT_RETURN_FORM, AffectReturnFields, setAffectReturnErrorToForm } from './affect-return.form';
import { formatAffectReturnError, toReturnToAffectTransfer } from './affect-return.presenter';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-affect-return',
  templateUrl: './affect-return.page.html'
})
export class AffectReturnPage implements OnChanges {
  @Input({ required: true }) public returnFareToAffect!: ReturnToAffectForDatePresentation;

  @Output() public affectReturnSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public affectReturnSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public affectReturnError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly affectReturn$ = (): Observable<object> =>
    this._affectReturnAction$(toReturnToAffectTransfer(AFFECT_RETURN_FORM.value as ReturnToAffectTransfer));

  public readonly affectReturnForm: FormGroup<AffectReturnFields> = AFFECT_RETURN_FORM;

  public selectedDate: Date = paramsToDate(this._route);

  public constructor(
    private readonly _route: ActivatedRoute,
    @Inject(AFFECT_RETURN_ACTION) private readonly _affectReturnAction$: AffectReturnAction
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['returnFareToAffect']?.firstChange === true) {
      this.initFormValue();
    }
  }

  private initFormValue(): void {
    this.affectReturnForm.controls.fareId.setValue(this.returnFareToAffect.id);
    this.affectReturnForm.controls.driveFrom.setValue(this.returnFareToAffect.departure);
    this.affectReturnForm.controls.driveTo.setValue(this.returnFareToAffect.destination);
  }

  public onSelectDepartureChange(place: PlacePresentation): void {
    this.affectReturnForm.controls.driveFrom.setValue(place);
  }

  public onSelectDestinationChange(place: PlacePresentation): void {
    this.affectReturnForm.controls.driveTo.setValue(place);
  }

  private readonly _departureDefault$: Subject<string> = new Subject<string>();
  public departureDefault$: Observable<string> = this._departureDefault$.asObservable();

  private readonly _destinationDefault$: Subject<string> = new Subject<string>();
  public destinationDefault$: Observable<string> = this._destinationDefault$.asObservable();
  private readonly _driverDefault$: Subject<string> = new Subject<string>();
  public driverDefault$: Observable<string> = this._driverDefault$.asObservable();
  public onSelectReturnToAffectChange(returnToAffect: ReturnToAffectForDatePresentation): void {
    this.affectReturnForm.controls.fareId.setValue(returnToAffect.id);

    this.affectReturnForm.controls.driveFrom.setValue(returnToAffect.departure);
    this._departureDefault$.next(returnToAffect.departure.label);
    this.affectReturnForm.controls.driveTo.setValue(returnToAffect.destination);
    this._destinationDefault$.next(returnToAffect.destination.label);

    this.affectReturnForm.controls.planning.setValue(returnToAffect.planning ?? '');
    this._driverDefault$.next(returnToAffect.planning ?? '');
  }

  public onSelectDriverChange(driver: UserPresentation): void {
    this.affectReturnForm.controls.planning.setValue(driver.identifier);
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

const paramsToDate = (params: Params): Date => (params['date'] == null ? new Date() : new Date(params['date'] as string));
