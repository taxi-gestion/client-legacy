import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UserFieldComponent, UserResultsDropdownComponent } from '../components';

@NgModule({
  declarations: [UserFieldComponent, UserResultsDropdownComponent],
  exports: [UserFieldComponent],
  imports: [CommonModule, ReactiveFormsModule]
})
export class UserFeatureModule {}
