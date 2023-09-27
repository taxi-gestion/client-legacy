import { FaresDeleted } from '@definitions';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { toLocalTime } from '../../common/fares.presenter';
import { toIdentity } from '@features/common/regular';

export const toDeleteFareSuccessToast = (fares: FaresDeleted): Toast => {
  const content: string =
    fares.pendingDeleted === undefined
      ? `Course pour ${toIdentity(fares.scheduledDeleted.passenger)} par ${
          fares.scheduledDeleted.driver.username
        } à ${toLocalTime(fares.scheduledDeleted.datetime)} supprimée`
      : `Course et Retour pour ${toIdentity(fares.scheduledDeleted.passenger)} par ${
          fares.scheduledDeleted.driver.username
        } à ${toLocalTime(fares.scheduledDeleted.datetime)} supprimés`;

  const title: string =
    fares.pendingDeleted === undefined ? 'Une course a été supprimée' : 'Une course et son retour on étés supprimés';

  return {
    content,
    status: 'success',
    title
  };
};
