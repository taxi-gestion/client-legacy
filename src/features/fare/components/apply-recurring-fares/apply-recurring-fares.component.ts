import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { ActivatedRoute, Router } from '@angular/router';
import { APPLY_RECURRING_ACTION, ApplyRecurringAction } from '../../providers/actions/apply-recurring.action.provider';
import { RecurringApplied } from '../../../../definitions';
import { Observable } from 'rxjs';
import { toRecurringAppliedSuccessToast } from './apply-recurring-fares.presenter';
import { toStandardDateFormat } from '../../../common/angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './apply-recurring-fares.component.html',
  selector: 'app-apply-recurrence'
})
export class ApplyRecurrenceComponent {
  @Output() public clicked: EventEmitter<void> = new EventEmitter<void>();

  @Output() public actionSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public actionError: EventEmitter<Error> = new EventEmitter<Error>();

  @Input() public date: Date | null = null;

  public readonly applyRecurring$ = (): Observable<RecurringApplied[]> =>
    this._applyRecurringAction$(toStandardDateFormat(this.date ?? new Date()));

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(APPLY_RECURRING_ACTION) private readonly _applyRecurringAction$: ApplyRecurringAction
  ) {}

  public onClick = (triggerAction: () => void): void => {
    triggerAction();
    this.clicked.emit();
  };

  public onActionSuccess = async (fares: RecurringApplied[]): Promise<void> => {
    this._toaster.toast(toRecurringAppliedSuccessToast(fares));
    await this._router.navigate(['../'], { relativeTo: this._route });
  };

  public onActionError = (error: Error): void => {
    this._toaster.toast({
      content: `Échec de l'application des récurrences: ${error.name} | ${error.message}`,
      status: 'danger',
      title: 'Opération échouée'
    });
  };
}
