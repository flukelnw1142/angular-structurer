import { Route } from '@angular/router';
import { BusDepotListComponent } from './bus-depot-list/bus-depot-list.component';
import { BusDepotManagementComponent } from './bus-depot-management.component';
export const busDepotManagementRoutes: Route[] = [
  {
    path: '',
    component: BusDepotManagementComponent,
    children: [{ path: '', component: BusDepotListComponent }],
  },
];
