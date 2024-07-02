import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { busLinesManagementRoutes } from './bus-lines-management.routing';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(busLinesManagementRoutes)],
  declarations: [
  ],
})
export class BusLinesManagementModule { }
