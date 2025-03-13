import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverDashboardRoutingModule } from './driver-dashboard-routing.module';
import { StatusToggleComponent } from './status-toggle/status-toggle.component';
import { CurrentTripComponent } from './current-trip/current-trip.component';
import { TripHistoryComponent } from './trip-history/trip-history.component';
import { SettingsComponent } from './settings/settings.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; // Add this line
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { DriverService } from 'src/app/services/driver/driver.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { MapService } from 'src/app/services/map/map.service';
import { SharedModule } from '../../shared/shared.module';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    StatusToggleComponent,
    CurrentTripComponent,
    TripHistoryComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DriverDashboardRoutingModule,
    MatSlideToggleModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    SharedModule,
    MatSelectModule
  ],
  providers:[
    DriverService,
    CustomerService,
    ReservationService,
    MapService
  ]
})
export class DriverDashboardModule { }
