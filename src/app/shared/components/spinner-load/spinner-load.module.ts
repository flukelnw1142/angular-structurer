import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpinnerLoadComponent } from './spinner-load.component';
@NgModule({
  imports: [CommonModule],
  declarations: [SpinnerLoadComponent],
  exports: [SpinnerLoadComponent],
})
export class SpinnerLoadModule { }
