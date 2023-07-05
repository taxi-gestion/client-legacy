import { Pipe, PipeTransform } from '@angular/core';
import { minutesToTime } from './minutes-to-time.presenter';

@Pipe({ name: 'minutesToTime' })
export class MinutesToTimePipe implements PipeTransform {
  public transform = (minutes: number): string => minutesToTime(minutes);
}
