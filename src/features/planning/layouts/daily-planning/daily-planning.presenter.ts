import { Params } from '@angular/router';
import { formatDateToDatetimeLocalString, toStandardDateFormat } from '../../common/unit-convertion';

export const paramsToDateDayString = (params: Params): string =>
  params['date'] == null ? toStandardDateFormat(new Date()) : (params['date'] as string);

export const paramsToDatetimeString = (params: Params): string =>
  params['date'] == null ? formatDateToDatetimeLocalString(new Date()) : (params['date'] as string);
