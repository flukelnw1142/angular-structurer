import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { busOperationRoutes } from './bus-operation-management.routing';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(busOperationRoutes)],
  declarations: [
  ],
})

export class BusOperationManagementModule { }