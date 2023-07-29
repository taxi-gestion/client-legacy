import { Component, Input } from '@angular/core';
import { ReturnToAffectForDatePresentation } from '../../../common/returns-to-affect.presentation';

@Component({
  selector: 'app-returns-to-affect-list',
  templateUrl: './returns-to-affect-list.component.html'
})
export class ReturnsToAffectListComponent {
  public showAffectReturnModal: boolean = false;

  @Input({ required: true }) public returnsToAffect!: ReturnToAffectForDatePresentation[];

  public handleAffectReturnModalClose(): void {
    this.showAffectReturnModal = false;
  }

  public openAffectReturnModal(): void {
    this.showAffectReturnModal = true;
  }
}
