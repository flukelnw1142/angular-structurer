import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { busTerminalManagementRoutes } from './bus-terminal-management.routing';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(busTerminalManagementRoutes)],
  declarations: [
  ],
})
export class BusTerminalManagementModule { }
