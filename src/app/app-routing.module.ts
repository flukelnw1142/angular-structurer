import { LayoutType } from './layout/layout.service';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './module/home/home.component';
import { NoAuthGuard } from './core/guards/noAuth.guard';
import { DashboardComponent } from './module/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/sign-in',
    pathMatch: 'full'
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
    path: 'bus-vehicle',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: LayoutType.AUTH
    },
    children: [
      { path: '', loadChildren: () => import('./module/bus-vehicle-management/bus-vehicle-management.module').then(m => m.BusVehicleManagementManagementModule), }
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
      { path: '', loadChildren: () => import('./module/user-management/user-management.module').then(m => m.UserManagementModule), }
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
      { path: '', loadChildren: () => import('./module/role-management/role-management.module').then(m => m.RoleManagementModule), }
    ]
  },
  {
    path: 'bus-depot',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: LayoutType.AUTH
    },
    children: [
      { path: '', loadChildren: () => import('./module/bus-depot-management/bus-depot-management.module').then(m => m.BusDepotManagementModule), }
    ]
  },
  {
    path: 'bus-division',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: LayoutType.AUTH
    },
    children: [
      { path: '', loadChildren: () => import('./module/bus-division-management/bus-division-management.module').then(m => m.BusDivisionManagementModule), }
    ]
  },
  {
    path: 'bus-type',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: LayoutType.AUTH
    },
    children: [
      { path: '', loadChildren: () => import('./module/bus-type-management/bus-type-management.module').then(m => m.BusTypeManagementModule), }
    ]
  },
  {
    path: 'fare',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: LayoutType.AUTH
    },
    children: [
      { path: '', loadChildren: () => import('./module/fare-management/fare-management.module').then(m => m.FareManagementModule), }
    ]
  },
  {
    path: 'bus-lines',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: LayoutType.AUTH
    },
    children: [
      { path: '', loadChildren: () => import('./module/bus-lines-management/bus-lines-management.module').then(m => m.BusLinesManagementModule), }
    ]
  },
  {
    path: 'bus-terminal',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: LayoutType.AUTH
    },
    children: [
      { path: '', loadChildren: () => import('./module/bus-terminal-management/bus-terminal-management.module').then(m => m.BusTerminalManagementModule), }
    ]
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
