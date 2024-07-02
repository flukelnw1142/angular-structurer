import { PrimeNgModule } from './../../../shared/primeng.module';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedAppModule } from 'src/app/shared/shared-app.module';
import { LoginComponent } from './login.component';

const routes: Routes = [{ path: '', component: LoginComponent }];

@NgModule({
  declarations: [LoginComponent],
  imports: [RouterModule.forChild(routes), PrimeNgModule, SharedAppModule],
})
export class LoginModule { }
