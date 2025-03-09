import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'customer-dashboard',
    loadChildren: () =>
      import('./customer-dashboard/customer-dashboard.module').then(
        (m) => m.CustomerDashboardModule
      ),
  },
  {
    path: 'driver-dashboard',
    loadChildren: () =>
      import('./driver-dashboard/driver-dashboard.module').then(
        (m) => m.DriverDashboardModule
      ),
  },
  {
    path: 'admin-dashboard',
    loadChildren: () =>
      import('./admin-dashboard/admin-dashboard.module').then(
        (m) => m.AdminDashboardModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostLoginRoutingModule {}
