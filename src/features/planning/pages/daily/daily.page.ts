import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FareForDate, FARES_FOR_DATE_QUERY, FaresForDate, FaresForDateQuery } from '@features/planning';
import { formatDate } from './daily.presenter';
import { ActivatedRoute } from '@angular/router';

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

type FaresByPlanning = {
  name: string;
  fares: FareForDate[];
}[];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './daily.page.html',
  styleUrls: ['./daily.page.css']
})
export class DailyPage {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly _dateFromUrl: string | null = this._route.snapshot.params['date'];
  private readonly _selectedDate: Date = this._dateFromUrl == null ? new Date() : new Date(this._dateFromUrl);
  public ddMMYYYYtoday: string = formatDate(this._selectedDate);

  public hours: Date[] = Array.from({ length: 24 }, (_: string, i: number): Date => new Date(0, 0, 0, i));

  public constructor(
    private readonly _route: ActivatedRoute,
    @Inject(FARES_FOR_DATE_QUERY) private readonly _faresForDateQuery: FaresForDateQuery
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
  public readonly faresForDate$: Observable<FaresForDate> = this._faresForDateQuery(this._selectedDate);

  public readonly faresByPlanning$: Observable<FaresByPlanning> = this.faresForDate$.pipe(map(groupFaresByPlanning));

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

const groupFaresByPlanning = (faresList: FareForDate[]): FaresByPlanning => {
  const groupedFares: Record<string, FareForDate[]> = faresList.reduce(
    (grouped: Record<string, FareForDate[]>, fare: FareForDate): Record<string, FareForDate[]> => {
      const groups: Record<string, FareForDate[]> = grouped;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const key: string = fare.planning;
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (groups[key] == null) groups[key] = [];
      groups[key]?.push(fare);
      return groups;
    },
    {}
  );

  // eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type
  return Object.entries(groupedFares).map(([planning, fares]) => ({ name: planning, fares }));
};
