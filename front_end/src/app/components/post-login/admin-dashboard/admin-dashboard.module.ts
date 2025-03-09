import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { BookingOverviewComponent } from './booking-overview/booking-overview.component';
import { DriverManagementComponent } from './driver-management/driver-management.component';
import { ReportsComponent } from './reports/reports.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
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
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { DriverService } from 'src/app/services/driver/driver.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { MapService } from 'src/app/services/map/map.service';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  declarations: [
    UserManagementComponent,
    BookingOverviewComponent,
    DriverManagementComponent,
    ReportsComponent,
    SystemSettingsComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    FormsModule,ReactiveFormsModule,
    GoogleMapsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SharedModule
  ],
  providers:[
    DriverService,
    CustomerService,
    ReservationService,
    MapService
  ]
})
export class AdminDashboardModule { }





