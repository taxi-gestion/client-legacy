import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FORM_CONTROL_ERROR_MESSAGES_TOKEN } from '@features/common/form-validation';
import { WAYPOINT_FORM_CONTROL_ERROR_MESSAGES } from '../../errors/form-errors-messages.token';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { filterOnWaypointValuesProperties } from './waypoint-field.presenter';
import { emptyWaypointValue } from '../../waypoint.presenter';
import { WaypointValues } from '../../definitions/waypoint.definition';
import { selectedWaypointValidator } from '../../validators';
import { Observable, of } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-waypoint-field',
  templateUrl: './waypoint-field.component.html',
  providers: [
    {
      provide: FORM_CONTROL_ERROR_MESSAGES_TOKEN,
      useValue: WAYPOINT_FORM_CONTROL_ERROR_MESSAGES
    }
  ]
})
export class WaypointFieldComponent {
  @Input({ required: true }) public waypointFieldControl!: FormControl<WaypointValues>;

  @Input() public prefilled: WaypointValues[] = [];

  @Input() public set waypoint(waypoint: (WaypointValues | undefined) | null) {
    waypoint !== null && this.onWaypointReceived(waypoint ?? emptyWaypointValue);
  }

  @Output() public readonly selectedValue: EventEmitter<WaypointValues> = new EventEmitter<WaypointValues>();

  public searchFormGroup: FormGroup<{ search: FormControl<string> }> = new FormGroup<{ search: FormControl<string> }>({
    search: new FormControl<string>('', { nonNullable: true, validators: [] })
  });

  public onWaypointReceived(waypointNumberValue: WaypointValues | undefined): void {
    this.defaultValue = waypointNumberValue;
  }

  public defaultValue: WaypointValues | undefined = emptyWaypointValue;

  public waypointEmptyValue: WaypointValues = emptyWaypointValue;

  public toSearchTerm = (waypointValues: WaypointValues): string => waypointValues.waypointName;

  public toTrackBy: (index: number, waypointValues: WaypointValues) => string = (
    _: number,
    waypointValues: WaypointValues
  ): string =>
    `${waypointValues.waypointName}${waypointValues.place.location.latitude}${waypointValues.place.location.longitude}`;

  public waypointValuesValidator: (waypointValues: WaypointValues | undefined) => ValidatorFn = selectedWaypointValidator;

  public query$ = (_searchTerm: string): Observable<WaypointValues[]> => of([]);

  public resultsFilter: (searchTerm: string) => (combinedResults: WaypointValues[]) => WaypointValues[] =
    filterOnWaypointValuesProperties;

  public onSelectedValueChange(waypoint: WaypointValues): void {
    this.waypointFieldControl.setValue(waypoint);
    this.selectedValue.emit(waypoint);
  }
}
