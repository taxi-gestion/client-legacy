import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { map, Observable, Subject, tap } from 'rxjs';
import { DELETE_REGULAR_ACTION, DeleteRegularAction, EDIT_REGULAR_ACTION, EditRegularAction } from '../../providers';
import { EDIT_REGULAR_FORM, EditRegularFields, setEditRegularErrorToForm } from './edit-regular.form';
import {
  checkIsEntity,
  formatEditRegularError,
  regularToDestinationsValues,
  regularToHomeAddressDisplay,
  regularToPhoneNumbers,
  toDeleteRegularSuccessToast,
  toEditRegularSuccessToast,
  toRegularDetailsEntity
} from './manage-regular.presenter';
import { ToasterPresenter } from '../../../../root/components/toaster/toaster.presenter';
import { ActivatedRoute, Router } from '@angular/router';
import { Entity, Place, RegularDeleted, RegularDetails, RegularEdited } from '@definitions';
import { PhonesFields, PhoneValues } from '../../components/regular/phones/phones.component';
import { DestinationsFields, DestinationValues } from '../../components/regular/destinations/destinations.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manage-regular.page.html'
})
export class ManageRegularPage {
  @Output() public editRegularSubmitted: EventEmitter<void> = new EventEmitter<void>();

  @Output() public editRegularSuccess: EventEmitter<void> = new EventEmitter<void>();

  @Output() public editRegularError: EventEmitter<Error> = new EventEmitter<Error>();

  public readonly editRegular$ = (): Observable<RegularEdited> =>
    this._editRegularAction$(toRegularDetailsEntity(EDIT_REGULAR_FORM.value));

  public readonly editRegularForm: FormGroup<EditRegularFields> = EDIT_REGULAR_FORM;

  //region form subject
  private readonly _regular$: Subject<Entity & RegularDetails> = new Subject<Entity & RegularDetails>();
  private _selectedRegular: Entity | null = null;

  public regular$: Observable<Entity & RegularDetails> = this._regular$.asObservable().pipe(
    tap((regular: Entity & RegularDetails): void => {
      this.editRegularForm.controls.regularId.setValue(regular.id);
      this.editRegularForm.controls.civility.setValue(regular.civility);
      this.editRegularForm.controls.firstname.setValue(regular.firstname);
      this.editRegularForm.controls.lastname.setValue(regular.lastname);
      this.editRegularForm.controls.commentary.setValue(regular.commentary);
      this.editRegularForm.controls.subcontractedClient.setValue(regular.subcontractedClient);
      this.editRegularForm.controls.homeAddress.setValue(regular.home);
      this._selectedRegular = { id: regular.id };
    })
  );

  public phones$: Observable<PhoneValues[]> = this.regular$.pipe(map(regularToPhoneNumbers));
  public destinations$: Observable<DestinationValues[]> = this.regular$.pipe(map(regularToDestinationsValues));
  public homeAddressDisplay$: Observable<string | undefined> = this.regular$.pipe(map(regularToHomeAddressDisplay));

  public constructor(
    private readonly _toaster: ToasterPresenter,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    @Inject(EDIT_REGULAR_ACTION) private readonly _editRegularAction$: EditRegularAction,
    @Inject(DELETE_REGULAR_ACTION) private readonly _deleteRegularAction$: DeleteRegularAction
  ) {}

  //region search-regular
  public onSelectRegularChange(regular: Entity & RegularDetails): void {
    this._regular$.next(regular);
  }
  //endregion

  //region form-binding
  public onSelectHomeAddressChange(place: Place): void {
    this.editRegularForm.controls.homeAddress.setValue(place);
  }

  public updatePhonesFields($event: PhonesFields): void {
    this.editRegularForm.controls.phones = $event;
  }

  public getPhonesFormArray(): FormArray {
    return this.editRegularForm.controls.phones;
  }

  public updateDestinationsFields($event: DestinationsFields): void {
    this.editRegularForm.controls.destinations = $event;
  }

  public getDestinationsFormArray(): FormArray {
    return this.editRegularForm.controls.destinations;
  }
  // endregion

  //region manage-regular
  public onSubmitEditRegular = (triggerAction: () => void): void => {
    this.editRegularForm.markAllAsTouched();
    this.editRegularForm.valid && triggerAction();
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

  //region delete regular
  public readonly deleteRegular$ = (): Observable<RegularDeleted> =>
    this._deleteRegularAction$(checkIsEntity(this._selectedRegular));

  public onDeleteRegularActionSuccess = async (payload: RegularDeleted): Promise<void> => {
    this._toaster.toast(toDeleteRegularSuccessToast(payload));
    await this._router.navigate(['..'], { relativeTo: this._route });
  };

  public onDeleteRegularActionError = (_error: Error): void => {
    this._toaster.toast({ content: 'Échec de la suppression', status: 'danger', title: 'Opération échouée' });
  };

  public onClickDeleteRegular = (triggerAction: () => void): void => {
    triggerAction();
  };
  //endregion
}
