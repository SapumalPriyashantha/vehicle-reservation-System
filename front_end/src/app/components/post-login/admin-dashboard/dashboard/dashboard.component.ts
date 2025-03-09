import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, map, switchMap } from 'rxjs';
import { ReservationStatus } from 'src/app/enums/ReservationStatus.enum';
import { IAdminReservation } from 'src/app/interface/IAdminReservation';
import { IBookingHistory } from 'src/app/interface/IBookingHistory';
import { IDriver } from 'src/app/interface/IDriver';
import { IResponse } from 'src/app/interface/IResponse';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { DriverService } from 'src/app/services/driver/driver.service';
import { MapService } from 'src/app/services/map/map.service';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { showError, showSuccess } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  protected ReservationStatus = ReservationStatus;
  protected totalPassengers: number = 0;
  protected totalDrivers: number = 0;
  protected ongoingTrips: number = 0;
  protected totalRevenue: number = 0;

  protected center = { lat: 6.927079, lng: 79.861244 };
  protected zoom = 13;

  protected markers: any[] = [];
  protected routePath: any[] = [];
  protected filteredPickupResults: any[] = [];
  protected filteredDropoffResults: any[] = [];

  protected drivers: IDriver[] = [];
  protected recentPayments:IBookingHistory[]=[];


  protected reservationForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private mapService: MapService,
    private service: ReservationService,
    private customerService: CustomerService,
    private driverService: DriverService
  ) {
    this.reservationForm = this.fb.group({
      customerName: ['', Validators.required],
      customerMobile: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      pickupLocation: ['', Validators.required],
      dropoffLocation: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadSummaryData();
    this.loadRecentPayments();

    this.reservationForm
      .get('pickupLocation')
      ?.valueChanges.pipe(
        debounceTime(300),
        switchMap((value) => this.searchLocations(value))
      )
      .subscribe((results) => {
        console.log(results);

        this.filteredPickupResults = results;
      });

    this.reservationForm
      .get('dropoffLocation')
      ?.valueChanges.pipe(
        debounceTime(300),
        switchMap((value) => this.searchLocations(value))
      )
      .subscribe((results) => {
        this.filteredDropoffResults = results;
      });
  }

  protected searchLocations(query: string) {
    if (query.length < 3) {
      return [];
    }
    return this.mapService.searchLocations(query).pipe(
      map((results) => results),
      untilDestroyed(this)
    );
  }

  protected loadSummaryData(): void {
    this.customerService
      .getUserCount()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.totalPassengers = res.data;
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });

    this.driverService
      .getDriverCount()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.totalDrivers = res.data;
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });

    this.service
      .getFullTotalIncome()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.totalRevenue = res.data;
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });

    this.service
      .getAllOngoingTripCount()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.ongoingTrips = res.data;
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });
  }

  protected loadRecentPayments(): void {
    
    this.service
      .getLast5Reservations()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.recentPayments = res.data;
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });
  }

  protected openReservationModal(dialogRef: TemplateRef<any>) {
    this.dialog.open(dialogRef);
  }

  protected searchDrivers(dialogRef: TemplateRef<any>) {
    this.driverService
      .findDrivers(this.markers[0].position.lng, this.markers[0].position.lat)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (!res.data.length) {
            showError({
              title: 'Oops',
              text: 'Currently,There is no any driver in your area.Please try again later',
            });
            return;
          }
          this.drivers = res.data;
          this.closeModal();
          this.dialog.open(dialogRef);
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });
  }

  protected reserveDriver(driver: IDriver) {
    const { customerName, customerMobile, customerEmail } =
      this.reservationForm.value;

    const reservationRequest: IAdminReservation = {
      name: customerName,
      email: customerEmail,
      mobileNumber: customerMobile,
      driverUserName: driver.userName,
      pickupLatitude: this.markers[0].position.lat,
      pickupLongitude: this.markers[0].position.lng,
      dropLatitude: this.markers[1].position.lat,
      dropLongitude: this.markers[1].position.lng,
    };

    this.service
      .makeAdminReservation(reservationRequest)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          showSuccess({
            title: 'Success',
            text: 'Reservation Successfully',
          });
          this.loadSummaryData();
          this.loadRecentPayments();
          this.closeModal();
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });
  }

  protected onPickupSelect(result: any) {
    this.addMarker(
      this.filteredPickupResults.find(
        (x: any) => x.place_id === result.option.id
      ),
      'Pickup'
    );
  }

  protected onDropoffSelect(result: any) {
    this.addMarker(
      this.filteredDropoffResults.find(
        (x: any) => x.place_id === result.option.id
      ),
      'Dropoff'
    );
  }

  protected addMarker(result: any, type: string) {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    this.markers = this.markers.filter((marker) => marker.label !== type);
    // Add marker to the map
    this.markers = [
      ...this.markers,
      { position: { lat, lng: lon }, label: result.display_name },
    ];

    // Center the map on the selected location
    this.center = { lat, lng: lon };
    this.zoom = 13;
  }

  protected closeModal() {
    this.dialog.closeAll();
  }
}
