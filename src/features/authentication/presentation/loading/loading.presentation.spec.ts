import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { START_LOADING, STOP_LOADING, whileLoading } from './loading.presentation';

it('should execute action while loading', async (): Promise<void> => {
  const action$: BehaviorSubject<string> = new BehaviorSubject<string>('execute action');

  const actionWhileLoading$: Observable<string> = whileLoading(() => action$.asObservable())(START_LOADING);

  const actionResult: string = await firstValueFrom(actionWhileLoading$);

  expect(actionResult).toBe('execute action');
});

it('should not execute action while not loading', async (): Promise<void> => {
  const action$: BehaviorSubject<string> = new BehaviorSubject<string>('execute action');

  const actionWhileLoading$: Observable<string> = whileLoading(() => action$.asObservable())(STOP_LOADING);

  await expect(firstValueFrom(actionWhileLoading$)).rejects.toEqual(new Error('no elements in sequence'));
});
