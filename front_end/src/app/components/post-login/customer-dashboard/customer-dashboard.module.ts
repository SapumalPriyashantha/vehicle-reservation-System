import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerDashboardRoutingModule } from './customer-dashboard-routing.module';
import { ReserveTaxiComponent } from './reserve-taxi/reserve-taxi.component';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { SettingsComponent } from './settings/settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { DriverService } from 'src/app/services/driver/driver.service';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { CarService } from 'src/app/services/car/car.service';
import {MatSelectModule} from '@angular/material/select';
@NgModule({
  declarations: [
    ReserveTaxiComponent,
    BookingHistoryComponent,
    SettingsComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    CustomerDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCardModule,
    MatExpansionModule,
    MatDialogModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  providers: [DriverService, CustomerService, ReservationService, CarService],
})
export class CustomerDashboardModule {}
