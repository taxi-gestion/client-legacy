import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar.component';

@NgModule({
  exports: [NavbarComponent],
  declarations: [NavbarComponent],
  imports: [CommonModule]
})
export class NavbarUiModule {}
