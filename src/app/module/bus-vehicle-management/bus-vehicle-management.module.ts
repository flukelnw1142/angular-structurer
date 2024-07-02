import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { busVehicleManagementRoutes } from './bus-vehicle-management.routing';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(busVehicleManagementRoutes)],
  declarations: [
  ],
})
export class BusVehicleManagementManagementModule { }
