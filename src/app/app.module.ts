import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedAppModule } from 'src/app/shared/shared-app.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChipModule } from 'primeng/chip';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginModule } from './module/authentication/login/login.module';
import { AuthModule } from './core/auth.module';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { SpinnerInterceptorService } from './shared/interceptor/spinner-interceptor.service';
import { SpinnerLoadModule } from './shared/components/spinner-load/spinner-load.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AccordionModule } from 'primeng/accordion';
import { ChartModule } from 'primeng/chart';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CardModule } from 'primeng/card';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { PrimeNgModule } from './shared/primeng.module';
import { TableModule } from 'primeng/table';
import { DashboardComponent } from './module/home/dashboard/dashboard.component';
import { UserManagementComponent } from './module/user-management/user-management.component';
import { RoleManagementComponent } from './module/role-management/role-management.component';
import { CustomerComponent } from './module/customer/customer.component';
import { SupplierComponent } from './module/supplier/supplier.component';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    UserManagementComponent,
    RoleManagementComponent,
    CustomerComponent,
    SupplierComponent,
  ],
  imports: [
    PrimeNgModule,
    ChartModule,
    ChipModule,
    ToolbarModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedAppModule,
    LoginModule,
    ToastModule,
    SpinnerLoadModule,
    AuthModule,
    ConfirmDialogModule,
    AccordionModule,
    ConfirmPopupModule,
    CardModule,
    TabMenuModule,
    TabViewModule,
    TableModule,
  ],
  providers: [MessageService, ConfirmationService, { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptorService, multi: true }],

  bootstrap: [AppComponent]
})
export class AppModule { }
