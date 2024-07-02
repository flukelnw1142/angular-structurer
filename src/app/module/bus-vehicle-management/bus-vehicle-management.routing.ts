import { Route } from '@angular/router';
import { BusVehicleListComponent } from './bus-vehicle-list/bus-vehicle-list.component';
import { BusVehicleManagementComponent } from './bus-vehicle-management.component';


export const busVehicleManagementRoutes: Route[] = [
  {
    path: '',
    component: BusVehicleManagementComponent,
    children: [{ path: '', component: BusVehicleListComponent }],
  },
];
