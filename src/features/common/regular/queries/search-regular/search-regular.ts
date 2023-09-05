import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SearchRegularQuery } from '../../providers';
import { Entity, Regular } from '@definitions';

export const searchRegularsQuery$ =
  (httpClient: HttpClient): SearchRegularQuery =>
  (search: string): Observable<(Entity & Regular)[]> =>
    httpClient.get<(Entity & Regular)[]>(`/api/regular/list`).pipe(map(filterByterm(search)));

const filterByterm =
  (search: string) =>
  (regulars: (Entity & Regular)[]): (Entity & Regular)[] =>
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    regulars.filter((regular: Entity & Regular): boolean =>
      `${regular.lastname} ${regular.firstname}`.toLowerCase().includes(search.toLowerCase())
    );
/*
const sortByProximity =
  (search: string) =>
  (regulars: Regular[]): Regular[] =>
    regulars.sort(
      (regularA: Regular, regularB: Regular): number =>
        calculateScore(regularB.regular, search) - calculateScore(regularA.regular, search)
    );

const calculateScore = (text: string, searchTerm: string): number => {
  const index: number = text.indexOf(searchTerm);
  if (index === -1) {
    return 0;
  }
  // Assign higher scores to matches that occur at the beginning of the text
  return 1 / (index + 1);
};
*/