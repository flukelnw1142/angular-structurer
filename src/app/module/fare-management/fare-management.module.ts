import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { fareManagementRoutes } from './fare-management.routing';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(fareManagementRoutes)],
  declarations: [
  ],
})
export class FareManagementModule { }
