import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { filter, map, Observable, switchMap } from 'rxjs';
import { DELETE_FARE_ACTION, DeleteFareAction } from '../../providers';
import { DailyPlanningLayout } from '../../layouts';
import { SessionContext } from '../../components/planning/planning-row/planning-row.component';
import { DailyDriverPlanning, ScheduledPlanningSession } from '../../common/fares.presentation';
import { ActivatedRoute, Router } from '@angular/router';
import { minutesToTime } from '../../pipes/minutes-to-time/minutes-to-time.presenter';
import { Entity, Scheduled } from '@domain';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { toDeleteFareSuccessToast } from './manage-fare.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manage-fare.page.html'
})
export class ManageFarePage {
  public selectedSessionContext$: Observable<SessionContext<ScheduledPlanningSession, DailyDriverPlanning>> =
    this._planning.selectedSessionContext$.pipe(filter(Boolean));

  /* eslint-disable @typescript-eslint/restrict-template-expressions */
  public selectedSessionDetails$: Observable<string> = this.selectedSessionContext$.pipe(
    map(
      (context: SessionContext<ScheduledPlanningSession, DailyDriverPlanning>): string => `
    ${context.rowContext.driver.username} conduit
    ${context.sessionContext.passenger}.
    Téléphone à contacter: ${context.sessionContext.phone}

    Départ: ${JSON.parse(context.sessionContext.departure as unknown as string).context}
    Destination:  ${JSON.parse(context.sessionContext.destination as unknown as string).context}
    Horaire: ${minutesToTime(context.sessionContext.startTimeInMinutes)}

    ${context.sessionContext.nature === 'medical' ? 'La course est à caractère médical.' : ''}
    ${context.sessionContext.kind === 'two-way' ? 'La course comporte un retour à affecter.' : ''}

    Le trajet est estimé à ${context.sessionContext.distance} Km pour ${context.sessionContext.duration} minutes.
    `
    )
  );
  /* eslint-enable @typescript-eslint/restrict-template-expressions */

  public readonly deleteFare$ = (): Observable<object> =>
    this.selectedSessionContext$.pipe(
      switchMap(
        (context: SessionContext<ScheduledPlanningSession, DailyDriverPlanning>): Observable<object> =>
          this._deleteFareAction$(context.sessionContext.id)
      )
    );

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _planning: DailyPlanningLayout,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(DELETE_FARE_ACTION) private readonly _deleteFareAction$: DeleteFareAction
  ) {}

  public onDeleteFareActionSuccess = async (payload: unknown): Promise<void> => {
    // TODO Type action and modify returned payload
    this._toaster.toast(toDeleteFareSuccessToast(payload as { rows: (Entity & Scheduled)[] }[]));
    await this._router.navigate(['..'], { relativeTo: this._route });
  };

  public onDeleteFareActionError = (_error: Error): void => {
    this._toaster.toast({ content: 'Échec de la suppression de la course', status: 'danger', title: 'Opération échouée' });
  };

  public onClickDeleteFare = (triggerAction: () => void): void => {
    triggerAction();
  };
}
