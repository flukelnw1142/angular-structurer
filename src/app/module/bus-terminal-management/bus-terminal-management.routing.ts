import { Route } from '@angular/router';
import { BusTerminalListComponent } from './bus-terminal-list/bus-terminal-list.component';
import { BusTerminalManagementComponent } from './bus-terminal-management.component';
export const  busTerminalManagementRoutes: Route[] = [
  {
    path: '',
    component: BusTerminalManagementComponent,
    children: [{ path: '', component: BusTerminalListComponent }],
  },
];
