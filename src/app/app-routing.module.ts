import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsListComponent } from './components/reports/reports-list/reports-list.component';
import { UsersComponent } from './components/auth/users/users.component';
import { ShopComponent } from './components/shop/shop.component';
import { CreateReportComponent } from './components/reports/create-report/create-report.component';
import { LoginComponent } from './components/auth/login/login.component';


const routes: Routes = [
  {
    path: '',
    component: ReportsListComponent
  },
  {
    path: 'create-report',
    component: CreateReportComponent,
  },
  {
    path: 'reports',
    component: ReportsListComponent,
  },
  {
    path: 'user-management',
    component: UsersComponent,
    data: { menuCode: ['SUPER_ADMIN'] }
  },
  {
    path: 'shop-management',
    component: ShopComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
