/* eslint-disable @typescript-eslint/naming-convention, max-lines-per-function */

import {
  animate,
  AnimationMetadata,
  AnimationTriggerMetadata,
  group,
  query,
  style,
  transition,
  trigger
} from '@angular/animations';

export const slideInAnimation = (pages: [string, string][]): AnimationTriggerMetadata =>
  trigger(
    'routeAnimations',
    pages.flatMap(([start, end]: [string, string]): AnimationMetadata[] => [
      transition(`${start} => ${end}`, [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            left: 0,
            opacity: 1,
            width: '100%',
            height: '100%',
            'align-items': 'center',
            display: 'flex'
          })
        ]),
        query(':enter', [style({ left: '100%', opacity: 0 })]),
        group([
          query(':leave', [animate('300ms ease-out', style({ left: '-100%', opacity: 0 }))]),
          query(':enter', [animate('300ms ease-out', style({ left: '0%', opacity: 1 }))])
        ])
      ]),
      transition(`${end} => ${start}`, [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            left: 0,
            opacity: 1,
            width: '100%',
            height: '100%',
            'align-items': 'center',
            display: 'flex'
          })
        ]),
        query(':enter', [style({ left: '-100%', opacity: 0 })]),
        group([
          query(':leave', [animate('300ms ease-out', style({ left: '100%', opacity: 0 }))]),
          query(':enter', [animate('300ms ease-out', style({ left: '0%', opacity: 1 }))])
        ])
      ])
    ])
  );
