import { AddRecurring, ToRecurring } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { pipe as fpipe } from 'fp-ts/function';
import { fold as eitherFold } from 'fp-ts/Either';
import { driverEmptyValue, toDriver } from '@features/common/driver';
import { toIdentity } from '@features/regular';
import { throwDecodeError } from '@features/common/form-validation';
import { kilometersToMeters, minutesToSeconds, toKind, toNature } from '@features/common/presentation';

import { toWaypoint } from '@features/common/waypoint';
import { RecurringToAddValues, toPassenger } from '../../presentation';
import { recurringToAddFormCodec } from '../fare.form';

export const toAddRecurringSuccessToast = (fares: AddRecurring): Toast => ({
  content: `Règle de récurrence pour ${toIdentity(fares.recurringCreated.passenger)} ajoutée`,
  status: 'success',
  title: 'Une règle de récurrence à été ajoutée'
});

export const toRecurringToAdd = (rawFormValues: unknown): ToRecurring =>
  fpipe(
    recurringToAddFormCodec.decode(rawFormValues),
    eitherFold(throwDecodeError('addRecurringFormCodec', rawFormValues), toDomain)
  );

export const toDomain = (formValues: RecurringToAddValues): ToRecurring => ({
  arrival: toWaypoint(formValues.arrivalPlace),
  departureTime: formValues.departureTime,
  returnTime: formValues.returnTime,
  departure: toWaypoint(formValues.departurePlace),
  distance: kilometersToMeters(formValues.driveDistance),
  driver: formValues.driver === undefined ? undefined : toDriver(formValues.driver),
  duration: minutesToSeconds(formValues.driveDuration),
  kind: toKind(formValues.isTwoWayDrive),
  nature: toNature(formValues.isMedicalDrive),
  passenger: toPassenger(formValues),
  recurrence: formValues.recurrenceRule,
  status: 'to-recurring'
});

// eslint-disable-next-line complexity
export const toActionsSummary = (formValues: Partial<RecurringToAddValues>): string[] => {
  const actions: string[] = [];

  if (formValues.isTwoWayDrive === true) actions.push('Une course et un retour seront créés');

  if (formValues.isTwoWayDrive === false) actions.push('Une course aller simple sera crée');

  if (formValues.driver === driverEmptyValue) actions.push('La course sera ajoutée aux courses non assignées');

  if (
    formValues.departureTime !== undefined &&
    formValues.departureTime.length > 0 &&
    formValues.driver !== undefined &&
    formValues.driver !== driverEmptyValue
  )
    actions.push(`La course sera affectée à ${formValues.driver.username} à ${formValues.departureTime}`);

  if (formValues.returnTime !== undefined && formValues.returnTime.length > 0)
    actions.push(`Le retour sera affecté à ${formValues.driver?.username} à ${formValues.returnTime}`);

  if (formValues.returnTime === '') actions.push('Le retour sera ajouté aux retours en attente');

  return actions;
};
