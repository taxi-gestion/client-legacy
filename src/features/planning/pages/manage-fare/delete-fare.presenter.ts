import { Entity, Pending, Scheduled } from '@domain';
import { Toast } from '../../../../root/components/toaster/toaster.presenter';
import { toLocalTime } from '../../common/fares.presenter';

export const toDeleteFareSuccessToast = (payload: [Entity & Scheduled, (Entity & Pending)?]): Toast => {
  // TODO Adapt & type api response to return right payload
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const content: string =
    payload[1] === undefined
      ? `Course pour ${payload[0].passenger} par ${payload[0].driver} à ${toLocalTime(payload[0].datetime)} supprimée`
      : `Course et Retour pour ${payload[0].passenger} par ${payload[0].driver} à ${toLocalTime(
          payload[0].datetime
        )} supprimés`;

  const title: string = payload[1] === undefined ? 'Une course a été supprimée' : 'Une course et son retour on étés supprimés';

  return {
    content,
    status: 'success',
    title
  };
};
