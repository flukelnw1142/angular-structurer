import { Route } from '@angular/router';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleManagementComponent } from './role-management.component';

export const roleManagementRoutes: Route[] = [
  {
    path: '',
    component: RoleManagementComponent,
    children: [{ path: '', component: RoleListComponent }],
  },
];
