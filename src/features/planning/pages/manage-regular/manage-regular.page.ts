import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { map, Observable, Subject, tap } from 'rxjs';
import { DELETE_REGULAR_ACTION, DeleteRegularAction, EDIT_REGULAR_ACTION, EditRegularAction } from '../../providers';
import { EDIT_REGULAR_FORM, EditRegularFields, EditRegularValues, setEditRegularErrorToForm } from './edit-regular.form';
import {
  formatEditRegularError,
  toDeleteRegular,
  toDeleteRegularSuccessToast,
  toEditRegular,
  toEditRegularPresentation,
  toEditRegularSuccessToast
} from './manage-regular.presenter';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { ActivatedRoute, Router } from '@angular/router';
import { Entity, Place, RegularDeleted, RegularDetails, RegularEdited } from '@definitions';
import {
  BootstrapValidationClasses,
  bootstrapValidationClasses,
  forceControlRevalidation,
  nullToUndefined
} from '@features/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manage-regular.page.html'
})
export class ManageRegularPage {
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

  //region form-binding
  private readonly _regular$: Subject<Entity & RegularDetails> = new Subject<Entity & RegularDetails>();

  public onSelectRegularChange(regular: Entity & RegularDetails): void {
    this._regular$.next(regular);
  }

  public onSelectHomeAddressChange(place: Place): void {
    this.editRegularForm.controls.homeAddress.setValue(place);
  }

  public regular$: Observable<EditRegularValues> = this._regular$.asObservable().pipe(
    tap((regular: Entity & RegularDetails): void => {
      this.editRegularForm.controls.regularId.setValue(regular.id);
      this.editRegularForm.controls.civility.setValue(regular.civility);
      this.editRegularForm.controls.firstname.setValue(regular.firstname);
      this.editRegularForm.controls.lastname.setValue(regular.lastname);
      this.editRegularForm.controls.commentary.setValue(regular.commentary);
      this.editRegularForm.controls.subcontractedClient.setValue(regular.subcontractedClient);
      this.editRegularForm.controls.homeAddress.setValue(regular.home);
      this._selectedRegular = { id: regular.id };
    }),
    map(toEditRegularPresentation)
  );
  //

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
  private _selectedRegular: Entity | null = null;
  public readonly deleteRegular$ = (): Observable<RegularDeleted> =>
    this._deleteRegularAction$(toDeleteRegular(this._selectedRegular));

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
