import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { roleManagementRoutes } from './role-management.routing';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(roleManagementRoutes)],
})
export class RoleManagementModule { }
