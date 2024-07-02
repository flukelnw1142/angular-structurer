import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { FilterPipe } from 'src/app/shared/pipes/filter.pipe';
import { userManagementRoutes } from './user-management.routing';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(userManagementRoutes)],
  declarations: [FilterPipe],
})
export class UserManagementModule { }
