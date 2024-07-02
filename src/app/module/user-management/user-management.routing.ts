import { Route } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserManagementComponent } from './user-management.component';

export const userManagementRoutes: Route[] = [
  {
    path: '',
    component: UserManagementComponent,
    children: [{ path: '', component: UserListComponent }],
  },
];
