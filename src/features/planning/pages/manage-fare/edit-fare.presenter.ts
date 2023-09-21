import { VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME, VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME } from '../../errors';
import { Entity, FaresEdited, ToEdit } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { regularToPassenger, toLocalTime } from '../../common/fares.presenter';
import { datetimeLocalToIso8601UTCString, kilometersToMeters, minutesToSeconds } from '../../common/unit-convertion';
import { FareToEditValues } from './edit-fare.form';
import { toPlace } from '@features/common/place';
import { toDriver } from '../../../common/driver/driver.presenter';
import { toIdentity } from '@features/common/regular';

/*export const sessionToFaresToEditValues = (
  selectedSession: SessionContext<ScheduledPlanningSession, DailyDriverPlanning>
): FareToEditValues =>
  ({
    arrivalPlace: selectedSession.sessionContext.destination, //toDestinationsFromPlace
    departureDatetime: selectedSession.sessionContext.datetime,
    departurePlace: selectedSession.sessionContext.departure,
    driveDistance: 0,
    driveDuration: 0,
    driver: selectedSession.sessionContext.driver, //toDriverValues
    id: selectedSession.sessionContext.id,
    isMedicalDrive: selectedSession.sessionContext.nature,
    isTwoWayDrive: selectedSession.sessionContext.kind,
    passenger: selectedSession.sessionContext.passenger, //toPassengerValues
    phoneToCall: toPhoneValues(selectedSession.sessionContext.passenger.phone)
  });*/

export const toEditFareSuccessToast = (fares: FaresEdited): Toast => ({
  content: `Course pour ${toIdentity(fares.scheduledEdited.passenger)} par ${
    fares.scheduledEdited.driver.username
  } à ${toLocalTime(fares.scheduledEdited.datetime)} planifiée`,
  status: 'success',
  title: 'Une course a été planifiée'
});

export const toFareToEdit = (formValues: FareToEditValues): Entity & ToEdit => ({
  id: formValues.id,
  //recurrence: formValues.recurrence,
  destination: toPlace(formValues.arrivalPlace.place),
  datetime: datetimeLocalToIso8601UTCString(formValues.departureDatetime),
  departure: toPlace(formValues.departurePlace),
  distance: kilometersToMeters(formValues.driveDistance),
  driver: toDriver(formValues.driver),
  duration: minutesToSeconds(formValues.driveDuration),
  kind: formValues.isTwoWayDrive ? 'two-way' : 'one-way',
  nature: formValues.isMedicalDrive ? 'medical' : 'standard',
  passenger: regularToPassenger(formValues),
  status: 'to-edit'
});

// TODO Réfléchir à la mutualisation des erreurs communes
export type FormattedEditFareError = { field?: string; errors: Record<string, unknown> };
export const formatEditFareError = (error: Error): FormattedEditFareError =>
  editFareErrorFormatMap.get(error.name)?.(error) ?? {
    errors: { unknown: true }
  };

const editFareErrorFormatMap: Map<string, (error: Error) => FormattedEditFareError> = new Map([
  [
    VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME,
    (error: Error): FormattedEditFareError => ({
      errors: {
        [VALIDATION_FAILED_BEFORE_API_CALL_ERROR_NAME]: error
      }
    })
  ],
  [
    VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME,
    (error: Error): FormattedEditFareError => ({
      errors: {
        [VALIDATION_FAILED_AFTER_API_CALL_ERROR_NAME]: error
      }
    })
  ]
]);
