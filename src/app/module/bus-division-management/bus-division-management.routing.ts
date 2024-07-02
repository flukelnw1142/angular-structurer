import { Route } from '@angular/router';
import { BusDivisionListComponent } from './bus-division-list/bus-division-list.component';
import { BusDivisionManagementComponent } from './bus-division-management.component';


export const divisionRoutes: Route[] = [
  {
    path: '',
    component: BusDivisionManagementComponent,
    children: [{ path: '', component: BusDivisionListComponent }],
  },
];
