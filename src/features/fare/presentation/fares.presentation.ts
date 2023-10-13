import { Entity } from '@definitions';
import { FormControl, Validators } from '@angular/forms';
import { PhoneField, phoneFieldFormControl, PhoneValues } from '@features/common/phone';
import { DriverField, driverFieldFormControl } from '../../common/driver/components/driver-field/driver-field.form';
import { DriverValues } from '@features/common/driver';
import { RegularField, regularFieldFormControl } from '../../common/regular/components/regular-field/regular-field.form';
import { RegularValues } from '@features/common/regular';
import { EstimateJourneyFields, estimateJourneyFieldsFormControl } from '@features/common/journey';
import { WaypointField, waypointFieldFormControl, WaypointValues } from '@features/common/waypoint';

export type FareValues = {
  passenger: Entity & RegularValues;
  phoneToCall: PhoneValues;
  departureDatetime: string;
  departurePlace: WaypointValues;
  arrivalPlace: WaypointValues;
  driveDuration: number;
  driveDistance: number;
  driver: DriverValues;
  isTwoWayDrive: boolean;
  isMedicalDrive: boolean;
};

export type FareFields = DriverField<'driver'> &
  EstimateJourneyFields<'driveDuration', 'driveDistance'> &
  PhoneField<'phoneToCall'> &
  RegularField<'passenger'> &
  WaypointField<'arrivalPlace'> &
  WaypointField<'departurePlace'> & {
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
  ...estimateJourneyFieldsFormControl('driveDuration', 'driveDistance'),
  ...driverFieldFormControl('driver'),
  ...waypointFieldFormControl('departurePlace'),
  ...waypointFieldFormControl('arrivalPlace'),
  isTwoWayDrive: new FormControl<FareValues['isTwoWayDrive']>(true, {
    nonNullable: true,
    validators: [Validators.required]
  }),
  isMedicalDrive: new FormControl<FareValues['isMedicalDrive']>(true, {
    nonNullable: true,
    validators: [Validators.required]
  })
});
