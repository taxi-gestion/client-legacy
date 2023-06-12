import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FareByDay, FARES_BY_DAY_QUERY, FaresByDayQuery } from '@features/planning';
import { formatDate } from './daily.presenter';

type Fare = {
  client: string;
  phone: string;
  departure: string;
  arrival: string;
  distance: number;
  duration: number;
  startTime: number;
};

type FaresByDriver = {
  driver: string;
  fares: Fare[];
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './daily.page.html'
})
export class DailyPage {
  private readonly _today: Date = new Date('2019-03-05');

  public today: string = formatDate(this._today);

  public hours: Date[] = Array.from({ length: 24 }, (_: string, i: number): Date => new Date(0, 0, 0, i));

  public constructor(@Inject(FARES_BY_DAY_QUERY) private readonly _faresByDayQuery: FaresByDayQuery) {}

  public readonly faresByDay$: Observable<FareByDay[]> = this._faresByDayQuery(new Date());

  public readonly faresByDriver: FaresByDriver[] = [
    {
      driver: 'Claude Perrault',
      fares: [
        {
          client: 'Inès Faure',
          phone: '0631864599',
          departure: "12 rue de l'église, 69210 L'Arbresle",
          arrival: 'Hôpital Dussot, 32 avenue Henri Dussot, 69009 Lyon',
          distance: 42856,
          duration: 60,
          startTime: 660
        }
      ]
    },
    {
      driver: 'Théophile Rancourt',
      fares: [
        {
          client: 'Laurent Lebrun',
          phone: '0741896341',
          departure: '5 rue du lavoir, 69330 Pommiers',
          arrival: 'Clinique du Valvert, 16 boulevard du Valvert, 69005 Lyon',
          distance: 107226,
          duration: 120,
          startTime: 480
        }
      ]
    }
  ];
}
