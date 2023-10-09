import { Entity } from '@definitions';
import { FormControl, Validators } from '@angular/forms';
import { PhoneField, phoneFieldFormControl, PhoneValues } from '@features/common/phone';
import { PlaceField, placeFieldFormControl } from '../../common/place/components/place-field/place-field.form';
import { PlaceValues } from '@features/common/place';
import { DestinationField, destinationFieldFormControl, DestinationValues } from '@features/common/destination';
import { DriverField, driverFieldFormControl } from '../../common/driver/components/driver-field/driver-field.form';
import { DriverValues } from '@features/common/driver';
import { RegularField, regularFieldFormControl } from '../../common/regular/components/regular-field/regular-field.form';
import { RegularValues } from '@features/common/regular';

export type FareValues = {
  passenger: Entity & RegularValues;
  phoneToCall: PhoneValues;
  departureDatetime: string;
  departurePlace: PlaceValues;
  arrivalPlace: DestinationValues;
  driver: DriverValues;
  isTwoWayDrive: boolean;
  isMedicalDrive: boolean;
};

export type FareFields = DestinationField<'arrivalPlace'> &
  DriverField<'driver'> &
  PhoneField<'phoneToCall'> &
  PlaceField<'departurePlace'> &
  RegularField<'passenger'> & {
    departureDatetime: FormControl<FareValues['departureDatetime']>;
    isTwoWayDrive: FormControl<FareValues['isTwoWayDrive']>;
    isMedicalDrive: FormControl<FareValues['isMedicalDrive']>;
  };

// eslint-disable-next-line max-lines-per-function
export const fareFormControls = (): FareFields => ({
  ...regularFieldFormControl('passenger'),
  ...phoneFieldFormControl('phoneToCall'),
  departureDatetime: new FormControl<FareValues['departureDatetime']>('', {
    nonNullable: true,
    validators: [Validators.required]
  }),
  ...driverFieldFormControl('driver'),
  ...placeFieldFormControl('departurePlace'),
  ...destinationFieldFormControl('arrivalPlace'),
  isTwoWayDrive: new FormControl<FareValues['isTwoWayDrive']>(true, {
    nonNullable: true,
    validators: [Validators.required]
  }),
  isMedicalDrive: new FormControl<FareValues['isMedicalDrive']>(true, {
    nonNullable: true,
    validators: [Validators.required]
  })
});
