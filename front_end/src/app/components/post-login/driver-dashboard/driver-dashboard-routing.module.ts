import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatusToggleComponent } from './status-toggle/status-toggle.component';
import { CurrentTripComponent } from './current-trip/current-trip.component';
import { SettingsComponent } from './settings/settings.component';
import { DriverDashboardComponent } from './driver-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DriverDashboardComponent,
    children: [
      { path: '', redirectTo: 'status-toggle', pathMatch: 'full' },
      { path: 'current-trip', component: CurrentTripComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'status-toggle', component: StatusToggleComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverDashboardRoutingModule {}
