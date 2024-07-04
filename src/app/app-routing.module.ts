import { LayoutType } from './layout/layout.service';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './core/guards/noAuth.guard';
import { DashboardComponent } from './module/home/dashboard/dashboard.component';
import { UserManagementComponent } from './module/user-management/user-management.component';
import { RoleManagementComponent } from './module/role-management/role-management.component';
import { CustomerComponent } from './module/customer/customer.component';
import { SupplierModule } from './module/supplier/supplier/supplier.module';
import { SupplierComponent } from './module/supplier/supplier.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/sign-in',
    pathMatch: 'full'
  },
 
  {
    path: 'sign-in',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LayoutComponent,
    data: {
      layout: LayoutType.NO_AUTH
    },
    children: [
      { path: '', loadChildren: () => import('./module/authentication/login/login.module').then(m => m.LoginModule), }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: LayoutType.AUTH
    },
    children: [
      { path: '', component: DashboardComponent }
    ]
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: LayoutType.AUTH
    },
    children: [
      { path: '', component: UserManagementComponent }
    ]
  },
  {
    path: 'role',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: LayoutType.AUTH
    },
    children: [
      { path: '', component: RoleManagementComponent }
    ]
  },
  {
    path: 'customer',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: LayoutType.AUTH
    },
    children: [
      { path: '', component: CustomerComponent }
    ]
  },
  {
    path: 'supplier',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: LayoutType.AUTH
    },
    children: [
      { path: '', component: SupplierComponent }
    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
