import { Route } from '@angular/router';
import { BusTypeListComponent } from './bus-type-list/bus-type-list.component';
import { BusTypeManagementComponent } from './bus-type-management.component';

export const  busTypeManagementRoutes: Route[] = [
  {
    path: '',
    component: BusTypeManagementComponent,
    children: [{ path: '', component: BusTypeListComponent }],
  },
];
