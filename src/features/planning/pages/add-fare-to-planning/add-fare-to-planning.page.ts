import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  ADD_FARE_TO_PLANNING_ACTION,
  AddFareToPlanningAction,
  FareByDay,
  FARES_BY_DAY_QUERY,
  FaresByDayQuery
} from '../../providers';
import { formatAddFaresToPlanningError, formatDate } from './add-fare-to-planning.presenter';
import {
  ADD_FARE_TO_PLANNING_FORM,
  AddFareToPlanningFields,
  setAddFareToPlanningErrorToForm
} from './add-fare-to-planning.form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-fare-to-planning.page.html'
})
export class AddFareToPlanningExperimentalPage {
  public readonly addFareToPlanning$ = (): Observable<object> =>
    this._addFareToPlanningAction$(ADD_FARE_TO_PLANNING_FORM.getRawValue());

  public readonly addFareToPlanningForm: FormGroup<AddFareToPlanningFields> = ADD_FARE_TO_PLANNING_FORM;

  public readonly faresByDay$: Observable<FareByDay[]> = this._faresByDayQuery$(new Date());

  public readonly today: string = formatDate(new Date());

  public constructor(
    @Inject(FARES_BY_DAY_QUERY) private readonly _faresByDayQuery$: FaresByDayQuery,
    @Inject(ADD_FARE_TO_PLANNING_ACTION) private readonly _addFareToPlanningAction$: AddFareToPlanningAction
  ) {}

  public onSubmitFareToAddToPlanning = (triggerAction: () => void): void => {
    ADD_FARE_TO_PLANNING_FORM.markAllAsTouched();
    ADD_FARE_TO_PLANNING_FORM.valid && triggerAction();
  };

  public onAddFareToPlanningActionSuccess = (): void => {
    ADD_FARE_TO_PLANNING_FORM.reset();
  };

  public onAddFareToPlanningActionError = (error: Error): void => {
    setAddFareToPlanningErrorToForm(formatAddFaresToPlanningError(error));
  };
}
