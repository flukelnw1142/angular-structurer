import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { divisionRoutes } from './bus-division-management.routing';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(divisionRoutes)],
  declarations: [
  ],
})

export class BusDivisionManagementModule { }