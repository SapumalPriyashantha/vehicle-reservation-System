import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDashboardComponent } from './customer-dashboard.component';
import { ReserveTaxiComponent } from './reserve-taxi/reserve-taxi.component';
import { AvailableDriversComponent } from './available-drivers/available-drivers.component';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { SettingsComponent } from './settings/settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerDashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'reserve-taxi', component: ReserveTaxiComponent },
      { path: 'available-drivers', component: AvailableDriversComponent },
      { path: 'booking-history', component: BookingHistoryComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerDashboardRoutingModule {}
