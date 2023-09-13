import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Place } from '@definitions';
import { defaultPlaceValue } from '../../../common/fares.presenter';
import {
  boolean as ioBoolean,
  string as ioString,
  Type,
  type as ioType,
  undefined as ioUndefined,
  union as ioUnion
} from 'io-ts';
import { placeCodec } from '@codecs';
import { destinationValidator, placeValidator } from './destinations.validator';

export type DestinationsFields = FormArray<FormGroup<DestinationFields>>;

export type DestinationFields = {
  name: FormControl<DestinationValues['name'] | null>;
  place: FormControl<DestinationValues['place'] | null>;
  isTwoWayDrive: FormControl<DestinationValues['isTwoWayDrive'] | null>;
  isMedicalDrive: FormControl<DestinationValues['isMedicalDrive'] | null>;
  comment: FormControl<DestinationValues['comment'] | null>;
};

export type DestinationValues = {
  name: string;
  place: Place;
  isTwoWayDrive: boolean;
  isMedicalDrive: boolean;
  comment: string | undefined;
};

export const destinationValuesCodec: Type<DestinationValues> = ioType({
  isTwoWayDrive: ioBoolean,
  isMedicalDrive: ioBoolean,
  place: placeCodec,
  comment: ioUnion([ioString, ioUndefined]),
  name: ioString
});

export const destinationsFormControls = (): Record<keyof { destinations: DestinationsFields }, DestinationsFields> => ({
  destinations: new FormArray<FormGroup<DestinationFields>>([])
});

@Component({
  selector: 'app-destinations',
  templateUrl: './destinations.component.html'
})
export class DestinationsComponent {
  @Input({ required: true }) public parentArray!: DestinationsFields;

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
  public createDestinationGroup(destination: DestinationValues | undefined): FormGroup<DestinationFields> {
    return new FormGroup<DestinationFields>(
      {
        name: new FormControl<DestinationValues['name']>(destination?.name ?? '', {
          nonNullable: true,
          validators: [Validators.required]
        }),
        place: new FormControl<DestinationValues['place']>(destination?.place ?? defaultPlaceValue, {
          nonNullable: true,
          validators: [Validators.required, placeValidator]
        }),
        isTwoWayDrive: new FormControl<DestinationValues['isTwoWayDrive']>(destination?.isTwoWayDrive ?? true, {
          nonNullable: true,
          validators: [Validators.required]
        }),
        isMedicalDrive: new FormControl<DestinationValues['isMedicalDrive']>(destination?.isMedicalDrive ?? true, {
          nonNullable: true,
          validators: [Validators.required]
        }),
        comment: new FormControl<DestinationValues['comment']>(destination?.comment ?? '', {
          nonNullable: true,
          validators: []
        })
      },
      [destinationValidator]
    );
  }

  public addDestination(destination: DestinationValues | undefined): void {
    this.parentArray.push(this.createDestinationGroup(destination));
  }

  public removeDestination(index: number): void {
    this.parentArray.removeAt(index);
  }

  public onSelectPlaceChange(place: Place, index: number): void {
    (this.parentArray.controls[index] as FormGroup).controls['place']?.setValue(place);
  }
}
