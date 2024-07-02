import { Route } from '@angular/router';
import { BusOperationListComponent } from './bus-operation-list/bus-operation-list.component';
import { BusOperationManagementComponent } from './bus-operation-management.component';

export const  busOperationRoutes: Route[] = [
  {
    path: '',
    component: BusOperationManagementComponent,
    children: [{ path: '', component: BusOperationListComponent }],
  },
];
