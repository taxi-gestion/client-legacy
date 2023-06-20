import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-experimental-modal',
  templateUrl: './experimental-modal.component.html',
  styleUrls: ['./experimental-modal.component.css']
})
export class ExperimentalModalComponent {
  @Output() public closeModal: EventEmitter<void> = new EventEmitter<void>();

  public close(): void {
    this.closeModal.emit();
  }
}
