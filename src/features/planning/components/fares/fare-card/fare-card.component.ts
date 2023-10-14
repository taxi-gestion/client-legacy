import { Component, Input } from '@angular/core';
import { FareDriverCardPresentation } from '../../../common/agenda.presenter';
import { PlaceValues } from '@features/common/place';

@Component({
  selector: 'app-fare-card',
  templateUrl: './fare-card.component.html'
})
export class FareCardComponent {
  @Input({ required: true }) public fare!: FareDriverCardPresentation;

  public getGoogleMapsLink(place: PlaceValues): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${place.context}&travelmode=driving`;
  }

  public getWazeLink(place: PlaceValues): string {
    return `https://www.waze.com/ul?ll=${place.location.latitude},${place.location.longitude}&navigate=yes`;
  }
}
