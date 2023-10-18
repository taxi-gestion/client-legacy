import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { FareFields } from '@features/fare';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { ActivatedRoute, Router } from '@angular/router';
import { ALLOCATE_UNASSIGNED_ACTION, AllocateUnassignedAction } from '../../providers';
import { nullToUndefined } from '@features/common/form-validation';
import { AllocateUnassigned, Entity } from '../../../../definitions';
import { toUnassignedFareSuccessToast, toUnassignedToAllocate } from './allocate-unassigned.presenter';
import { RegularValues } from '../../../common/regular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './allocate-unassigned.component.html',
  selector: 'app-allocate-unassigned'
})
export class AllocateUnassignedComponent {
  @Input({ required: true }) public fareForm!: FormGroup<FareFields>;
  @Input({ required: true }) public regularControl!: FormControl<Entity & RegularValues>;

  @Input() public mode: 'create' | 'edit' = 'create';

  @Output() public clicked: EventEmitter<void> = new EventEmitter<void>();

  @Output() public actionSuccess: EventEmitter<AllocateUnassigned> = new EventEmitter<AllocateUnassigned>();

  @Output() public actionError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly unassignedFare$ = (): Observable<AllocateUnassigned> =>
    this._unassignedFareAction$(
      toUnassignedToAllocate(
        nullToUndefined({
          ...this.fareForm.value,
          passenger: { ...this.regularControl.value }
        })
      )
    );

  public onClick = (triggerAction: () => void): void => {
    triggerAction();
    this.clicked.emit();
  };

  public onActionSuccess = async (fares: AllocateUnassigned): Promise<void> => {
    this.actionSuccess.emit(fares);
    this.fareForm.reset();
    this._toaster.toast(toUnassignedFareSuccessToast(fares));
    await this._router.navigate(['../../'], { relativeTo: this._route });
  };

  public onActionError = (error: Error): void => {
    this.actionError.emit(error);
  };

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(ALLOCATE_UNASSIGNED_ACTION) private readonly _unassignedFareAction$: AllocateUnassignedAction
  ) {}
}
