import { Component, Input } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BootstrapValidationClasses, bootstrapValidationClasses } from '@features/common/form-validation';
import { placeFieldFormControl } from '../../../place/components/place-field/place-field.form';
import { DestinationValues } from '../../definitions/destination.definition';
import { DestinationsArrayElementFields } from './destinations.form';

@Component({
  selector: 'app-destinations',
  templateUrl: './destinations.component.html'
})
export class DestinationsComponent {
  public validation: (control: AbstractControl) => BootstrapValidationClasses = bootstrapValidationClasses;

  @Input({ required: true }) public parentArray!: FormArray<FormGroup<DestinationsArrayElementFields>>;

  @Input() public set destinations(destinations: (DestinationValues[] | undefined) | null) {
    destinations != null && this.onDestinationsReceived(destinations);
  }

  public onDestinationsReceived(destinationValues: DestinationValues[]): void {
    this.parentArray.clear();
    destinationValues.forEach((destination: DestinationValues): void => {
      this.addDestination(destination);
    });
  }

  // eslint-disable-next-line max-lines-per-function
  public createDestinationGroup(destination: DestinationValues | undefined): FormGroup<DestinationsArrayElementFields> {
    return new FormGroup<DestinationsArrayElementFields>({
      destinationName: new FormControl<DestinationValues['destinationName']>(destination?.destinationName ?? '', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      ...placeFieldFormControl('place', destination?.place),
      isTwoWayDrive: new FormControl<DestinationValues['isTwoWayDrive']>(destination?.isTwoWayDrive ?? true, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      isMedicalDrive: new FormControl<DestinationValues['isMedicalDrive']>(destination?.isMedicalDrive ?? true, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      comment: new FormControl<DestinationValues['comment']>(destination?.comment, {
        nonNullable: true,
        validators: []
      })
    });
  }

  public addDestination(destination: DestinationValues | undefined): void {
    this.parentArray.push(this.createDestinationGroup(destination));
  }

  public removeDestination(index: number): void {
    this.parentArray.removeAt(index);
  }
}
