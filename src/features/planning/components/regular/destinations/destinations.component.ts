import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

//const DESTINATION_FORM_GROUP: FormGroup<DestinationFields> = new FormGroup<DestinationFields>(
//  {
//    name: new FormControl<DestinationValues['name']>('', [Validators.required]),
//    place: new FormControl<DestinationValues['place']>(defaultPlaceValue, [Validators.required]),
//    isTwoWayDrive: new FormControl<DestinationValues['isTwoWayDrive']>(true, [Validators.required]),
//    isMedicalDrive: new FormControl<DestinationValues['isMedicalDrive']>(true, [Validators.required]),
//    comment: new FormControl<DestinationValues['comment']>('', [])
//  },
//  []
//);

export const DESTINATIONS_FORM_CONTROLS: Record<keyof { destinations: DestinationsFields }, DestinationsFields> = {
  destinations: new FormArray<FormGroup<DestinationFields>>([])
};

@Component({
  selector: 'app-destinations',
  templateUrl: './destinations.component.html'
})
export class DestinationsComponent {
  @Input({ required: true }) public parentArray!: DestinationsFields;

  @Input() public set destinations(destinations: DestinationValues[] | null) {
    destinations != null && this.onDestinationsReceived(destinations);
  }

  @Output() public formControlUpdated: EventEmitter<DestinationsFields> = new EventEmitter<DestinationsFields>();

  public onDestinationsReceived(destinationValues: DestinationValues[]): void {
    this.parentArray.clear();
    destinationValues.forEach((destination: DestinationValues): void => {
      this.addDestination(destination);
    });
    this.formControlUpdated.emit(new FormArray(this.parentArray.controls.filter(onlyValidControl)));
  }

  public onFormChange(): void {
    if (!this.parentArray.valid) return;
    this.formControlUpdated.emit(new FormArray(this.parentArray.controls.filter(onlyValidControl)));
  }

  public constructor(private readonly formBuilder: FormBuilder) {}

  public createDestinationGroup(destination: DestinationValues | undefined): FormGroup<DestinationFields> {
    return this.formBuilder.group({
      name: [destination?.name ?? '', [Validators.required]],
      place: [destination?.place ?? defaultPlaceValue, [Validators.required]],
      isTwoWayDrive: [destination?.isTwoWayDrive ?? true, [Validators.required]],
      isMedicalDrive: [destination?.isMedicalDrive ?? true, [Validators.required]],
      comment: [destination?.comment, []]
    });
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

const onlyValidControl = (destinationFormControl: FormGroup<DestinationFields>): boolean => destinationFormControl.valid;
