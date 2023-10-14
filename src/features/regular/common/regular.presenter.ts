import { Civility, Regular } from '@definitions';
import { toPhone } from '@features/common/phone';
import { RegularValues } from '@features/common/regular';
import { toWaypoint } from '@features/common/waypoint';
import { ValidationFailedBeforeApiCallError } from '@features/common/form-validation';

export const throwDecodeError = (codecName: string, rawFormValues: unknown) => (): never => {
  throw new ValidationFailedBeforeApiCallError(
    `${codecName} decode error with payload ${JSON.stringify(rawFormValues, null, 2)}`
  );
};

export const isEmptyOrWhitespace = (str: string): boolean => str === '' || str.trim() === '';

export const toRegular = (formValues: RegularValues): Regular => ({
  civility: formValues.civility,
  firstname: formValues.firstname,
  lastname: formValues.lastname,
  phones: formValues.phones?.map(toPhone),
  comment: formValues.comment === undefined || isEmptyOrWhitespace(formValues.comment) ? undefined : formValues.comment,
  waypoints: formValues.waypoints?.map(toWaypoint),
  subcontractedClient:
    formValues.subcontractedClient === undefined || isEmptyOrWhitespace(formValues.subcontractedClient)
      ? undefined
      : formValues.subcontractedClient
});

export const firstnameOrEmpty = (regular: { firstname: string | undefined }): string =>
  regular.firstname === undefined ? '' : `${regular.firstname} `;

export const passengerIdentity = (passenger: { civility: Civility; firstname: string | undefined; lastname: string }): string =>
  `${passenger.civility} ${firstnameOrEmpty(passenger)}${passenger.lastname}`;
