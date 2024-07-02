import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { busTypeManagementRoutes } from './bus-type-management.routing';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(busTypeManagementRoutes)],
  declarations: [
  ],
})
export class BusTypeManagementModule { }
