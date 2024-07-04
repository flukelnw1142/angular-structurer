import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { busDepotManagementRoutes } from './bus-depot-management.routing';
@NgModule({
  imports: [SharedModule, RouterModule.forChild(busDepotManagementRoutes)],
  declarations: [
  ],
})
export class BusDepotManagementModule { }
