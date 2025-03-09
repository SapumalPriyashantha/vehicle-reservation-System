import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { BookingOverviewComponent } from './booking-overview/booking-overview.component';
import { DriverManagementComponent } from './driver-management/driver-management.component';
import { ReportsComponent } from './reports/reports.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { 
    path: '', 
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } ,
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'booking-overview', component: BookingOverviewComponent },
      { path: 'driver-management', component: DriverManagementComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'system-settings', component: SystemSettingsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }
