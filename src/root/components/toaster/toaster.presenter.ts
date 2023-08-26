import { BehaviorSubject, Observable } from 'rxjs';
import { ToastStatus } from '../toast/toast.component';

export type Toast = {
  title: string;
  content: string;
  status?: ToastStatus;
};

const except =
  (indexToRemove: number) =>
  (_: Toast, index: number): boolean =>
    indexToRemove !== index;

export class ToasterPresenter {
  private _toasts: Toast[] = [];
  private readonly _toasts$: BehaviorSubject<Toast[]> = new BehaviorSubject<Toast[]>(this._toasts);
  public readonly toasts$: Observable<Toast[]> = this._toasts$.asObservable();

  public removeAt(indexToRemove: number): void {
    this._toasts = this._toasts.filter(except(indexToRemove));
    this._toasts$.next(this._toasts);
  }

  public toast(toast: Toast): void {
    this._toasts = [...this._toasts, toast];
    this._toasts$.next(this._toasts);
  }
}
