import { Route } from '@angular/router';
import { FareListComponent } from './fare-list/fare-list.component';
import { FareManagementComponent } from './fare-management.component';
export const  fareManagementRoutes: Route[] = [
  {
    path: '',
    component: FareManagementComponent,
    children: [{ path: '', component: FareListComponent }],
  },
];
