import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControlErrorsComponent } from '../components/errors/form-control-errors/form-control-errors.component';

@NgModule({
  declarations: [FormControlErrorsComponent],
  exports: [FormControlErrorsComponent],
  imports: [CommonModule, ReactiveFormsModule]
})
export class FormValidationComponentModule {}
