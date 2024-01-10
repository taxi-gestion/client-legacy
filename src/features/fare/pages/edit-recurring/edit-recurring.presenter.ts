import { Entity, Recurring } from '../../../../definitions';
import { filterByProperties } from '../../../../core/filters.core';
import { pipe as fpipe } from 'fp-ts/lib/function';
import { RecurringPresentation } from '../../presentation';

/* eslint-disable */

const translateRRuleToFrench = (rrule: string): string => {
  const daysOfWeek = {
    MO: 'Lundi',
    TU: 'Mardi',
    WE: 'Mercredi',
    TH: 'Jeudi',
    FR: 'Vendredi',
    SA: 'Samedi',
    SU: 'Dimanche'
  };

  const frequencies = {
    '1': 'Chaque semaine',
    '2': 'Toutes les 2 semaines',
    '3': 'Toutes les 3 semaines',
    '4': 'Toutes les 4 semaines'
  };

  // Extract days and frequency from RRULE
  const dayMatch = rrule.match(/BYDAY=([A-Z,]+)/);
  const freqMatch = rrule.match(/INTERVAL=(\d)/);

  let days = 'Jours inconnus';
  if (dayMatch) {
    // @ts-ignore
    const dayTokens = dayMatch[1].split(',');
    // @ts-ignore
    const translatedDays = dayTokens.map((day) => daysOfWeek[day] || day);
    days = translatedDays.join(', ');
  }

  // @ts-ignore
  const freq = freqMatch ? frequencies[freqMatch[1]] : 'Périodicité inconnue';

  // Extract start date
  //const startDateMatch = rrule.match(/DTSTART:(\d{4})(\d{2})(\d{2})/);
  //let startDate = 'Date de début inconnue';
  //if (startDateMatch) {
  //  startDate = `A partir du : ${startDateMatch[3]}/${startDateMatch[2]}/${startDateMatch[1]}`;
  //}
  //. ${startDate}
  return `${days}, ${freq}`;
};
/* eslint-enable */

/* eslint-disable */

const getStartDateIfLaterThanNow = (rrule: string): string => {
  const startDateMatch = rrule.match(/DTSTART:(\d{4})(\d{2})(\d{2})/);
  let startDate = 'Date de début inconnue'; // Default message
  if (startDateMatch) {
    const year = parseInt(startDateMatch[1]!, 10);
    const month = parseInt(startDateMatch[2]!, 10) - 1; // Month index is 0-based
    const day = parseInt(startDateMatch[3]!, 10);

    const startDateObj = new Date(year, month, day);
    const now = new Date();

    if (startDateObj > now) {
      // The start date is in the future
      startDate = `A partir du : ${startDateMatch[3]}/${startDateMatch[2]}/${startDateMatch[1]}`;
    } else {
      // The start date is not in the future
      startDate = ''; // Or you can return a message indicating the start date has passed
    }
  }
  return startDate;
};

/* eslint-enable */

export const toRecurringFaresPresentation = (recurringFares: (Entity & Recurring)[]): RecurringPresentation[] =>
  recurringFares.map(toRecurringFarePresentation);

const toRecurringFarePresentation = (fare: Entity & Recurring): RecurringPresentation => ({
  ...fare,
  departureTime: fare.departureTime.slice(0, 5),
  returnTime: fare.returnTime?.slice(0, 5),
  recurrenceDisplay: translateRRuleToFrench(fare.recurrence),
  startLater: getStartDateIfLaterThanNow(fare.recurrence)
});

export const toFilteredRecurringPresentation = ([fares, filterTerm]: [
  (Entity & Recurring)[],
  string
]): RecurringPresentation[] =>
  fpipe(
    fares,
    toRecurringFaresPresentation,
    filterByProperties<RecurringPresentation>({
      passenger: (item: RecurringPresentation): string => item.passenger.lastname, // Nested property
      recurrenceDisplay: 'recurrenceDisplay' // Direct property access
    })(filterTerm)
  );
