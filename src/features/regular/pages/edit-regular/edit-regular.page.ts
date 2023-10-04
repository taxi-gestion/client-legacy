import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { DELETE_REGULAR_ACTION, DeleteRegularAction, EDIT_REGULAR_ACTION, EditRegularAction } from '../../providers';
import { EDIT_REGULAR_FORM, EditRegularFields, EditRegularValues, setEditRegularErrorToForm } from './edit-regular.form';
import {
  formatEditRegularError,
  toDeleteRegular,
  toDeleteRegularSuccessToast,
  toEditRegular,
  toEditRegularPresentation,
  toEditRegularSuccessToast
} from './edit-regular.presenter';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { ActivatedRoute, Router } from '@angular/router';
import { Entity, RegularDeleted, RegularEdited } from '@definitions';
import {
  BootstrapValidationClasses,
  bootstrapValidationClasses,
  forceControlRevalidation,
  nullToUndefined
} from '@features/common/form-validation';
import { regularEmptyValue, regularHasId, RegularValues } from '@features/common/regular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-regular.page.html'
})
export class EditRegularPage {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Output() public editRegularSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public editRegularSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public editRegularError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly editRegularForm: FormGroup<EditRegularFields> = EDIT_REGULAR_FORM;

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(EDIT_REGULAR_ACTION) private readonly _editRegularAction$: EditRegularAction,
    @Inject(DELETE_REGULAR_ACTION) private readonly _deleteRegularAction$: DeleteRegularAction
  ) {}

  private readonly _regular$: BehaviorSubject<Entity & RegularValues> = new BehaviorSubject<Entity & RegularValues>(
    regularEmptyValue
  );

  public onSelectRegularChange(regular: Entity & RegularValues): void {
    this._regular$.next(regular);
  }

  public regular$: Observable<EditRegularValues> = this._regular$.asObservable().pipe(
    map(toEditRegularPresentation),
    tap((regularValues: EditRegularValues): void => {
      this.editRegularForm.controls.civility.setValue(regularValues.civility);
      this.editRegularForm.controls.firstname.setValue(regularValues.firstname);
      this.editRegularForm.controls.lastname.setValue(regularValues.lastname);
      this.editRegularForm.controls.commentary.setValue(regularValues.commentary);
      this.editRegularForm.controls.subcontractedClient.setValue(regularValues.subcontractedClient);
    })
  );

  public validRegular$: Observable<boolean> = this._regular$
    .asObservable()
    .pipe(map((regular: Entity & RegularValues): boolean => regularHasId(regular)));

  //region action edit regular
  public readonly editRegular$ = (): Observable<RegularEdited> =>
    this._editRegularAction$(toEditRegular(nullToUndefined(EDIT_REGULAR_FORM.value)));

  public onSubmitEditRegular = (triggerAction: () => void): void => {
    this.editRegularForm.markAllAsTouched();
    this.editRegularForm.valid ? triggerAction() : forceControlRevalidation(this.editRegularForm);
  };

  public onEditRegularActionSuccess = async (regular: RegularEdited): Promise<void> => {
    this.editRegularForm.reset();
    this._toaster.toast(toEditRegularSuccessToast(regular));
    await this._router.navigate(['..'], { relativeTo: this._route });
  };

  public onEditRegularActionError = (error: Error): void => {
    setEditRegularErrorToForm(formatEditRegularError(error));
    this._toaster.toast({
      content: `Échec de l'enregistrement : ${error.name} ${error.message}`,
      status: 'danger',
      title: 'Opération échouée'
    });
  };
  // endregion

  //region action delete regular
  public readonly deleteRegular$ = (): Observable<RegularDeleted> =>
    this._deleteRegularAction$(toDeleteRegular(this._regular$.getValue()));

  public onDeleteRegularActionSuccess = async (payload: RegularDeleted): Promise<void> => {
    this._toaster.toast(toDeleteRegularSuccessToast(payload));
    await this._router.navigate(['..'], { relativeTo: this._route });
  };

  public onDeleteRegularActionError = (error: Error): void => {
    this._toaster.toast({
      content: `Échec de la suppression: ${error.name} ${error.message}`,
      status: 'danger',
      title: 'Opération échouée'
    });
  };

  public onClickDeleteRegular = (triggerAction: () => void): void => {
    triggerAction();
  };
  //endregion
}
