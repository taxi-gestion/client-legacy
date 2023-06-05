import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { catchError, map, mergeWith, Observable, Subject, switchMap, tap } from 'rxjs';
import { FareByDayPresentation } from '../../presentation';
import { FARES_BY_DAY_READ, FaresByDayRead } from '../../providers';
import { formatAddFaresToPlanningError, formatDate } from './add-fare-to-planning.presenter';
import { FormControl, FormGroup } from '@angular/forms';
import { ADD_FARE_TO_PLANNING_FORM, setAddFareToPlanningErrorToForm } from './add-fare-to-planning.form';
import { START_LOADING, STOP_LOADING, whileLoading } from '../../../authentication/presentation';
import {
  ADD_FARE_TO_PLANNING_ACTION,
  AddFareToPlanningAction
} from '../../providers/actions/add-fare-to-planning.action.provider';

export type AddFareToPlanningFields = {
  clientIdentity: FormControl<string>;
  clientPhone: FormControl<string>;
  date: FormControl<Date>;
  driveFrom: FormControl<string>;
  driveKind: FormControl<'one-way' | 'outward' | 'return'>;
  driveNature: FormControl<'medical' | 'standard'>;
  driverIdentity: FormControl<string>;
  driveTo: FormControl<string>;
  startTime: FormControl<string>;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-fare-to-planning.page.html'
})
export class AddFareToPlanningExperimentalPage {
  private readonly _isAddingFareToPlanning$: Subject<boolean> = new Subject<boolean>();

  private readonly _addFareToPlanning$: Observable<boolean> = this._isAddingFareToPlanning$.pipe(
    switchMap(whileLoading((): Observable<object> => this._addFareToPlanningAction$(this.addFareToPlanningForm.getRawValue()))),
    catchError(this.handleAddFareToPlanningActionError.bind(this)),
    tap((): void => ADD_FARE_TO_PLANNING_FORM.reset()),
    map((): boolean => STOP_LOADING)
  );

  public readonly isAddingFareToPlanning$: Observable<boolean> = this._isAddingFareToPlanning$.pipe(
    mergeWith(this._addFareToPlanning$)
  );

  private handleAddFareToPlanningActionError(error: Error, caught: Observable<object>): Observable<object> {
    setAddFareToPlanningErrorToForm(formatAddFaresToPlanningError(error));
    this._isAddingFareToPlanning$.next(STOP_LOADING);
    return caught;
  }

  private readonly _today: Date = new Date();

  public constructor(
    @Inject(FARES_BY_DAY_READ) private readonly _faresByDayRead$: FaresByDayRead,
    @Inject(ADD_FARE_TO_PLANNING_ACTION) private readonly _addFareToPlanningAction$: AddFareToPlanningAction
  ) {}

  public addFareToPlanningForm: FormGroup<AddFareToPlanningFields> = ADD_FARE_TO_PLANNING_FORM;

  public readonly faresByDay$: Observable<FareByDayPresentation[]> = this._faresByDayRead$(this._today);

  public today: string = formatDate(this._today);

  public onAddFareToPlanning = (): void => {
    ADD_FARE_TO_PLANNING_FORM.markAllAsTouched();
    ADD_FARE_TO_PLANNING_FORM.valid && this._isAddingFareToPlanning$.next(START_LOADING);
  };
}
