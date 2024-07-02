import { Route } from '@angular/router';
import { BusLinesListComponent } from './bus-lines-list/bus-lines-list.component';
import { BusLinesManagementComponent } from './bus-lines-management.component';
export const busLinesManagementRoutes: Route[] = [
  {
    path: '',
    component: BusLinesManagementComponent,
    children: [{ path: '', component: BusLinesListComponent }],
  },
];
