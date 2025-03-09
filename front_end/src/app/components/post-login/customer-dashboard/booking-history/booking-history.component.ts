import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, map, take } from 'rxjs';
import { ReservationStatus } from 'src/app/enums/ReservationStatus.enum';
import { IAddRate } from 'src/app/interface/IAddRate';
import { IBookingHistory } from 'src/app/interface/IBookingHistory';
import { IResponse } from 'src/app/interface/IResponse';
import { IUser } from 'src/app/interface/IUser';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { DriverService } from 'src/app/services/driver/driver.service';
import { MapService } from 'src/app/services/map/map.service';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { StorageService } from 'src/app/services/storage.service';
import { showError, showSuccess } from 'src/app/utility/helper';
import Swal from 'sweetalert2';

@UntilDestroy()
@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.scss'],
})
export class BookingHistoryComponent implements OnInit {
  protected ReservationStatus = ReservationStatus;
  protected user: IUser;
  protected trips: IBookingHistory[] = [];

  protected selectedRating: number = 0;
  protected reviewText: string;

  protected pickUpLocations: { [tripId: string]: Observable<string> } = {};
  protected dropOffLocations: { [tripId: string]: Observable<string> } = {};

  protected tripId: number;
  protected driverId: number;
  protected driverName: string;
  protected driverImage: string;

  constructor(
    private dialog: MatDialog,
    private service: ReservationService,
    private storage: StorageService,
    private userService: CustomerService,
    private mapService: MapService,
    private driverService: DriverService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.user = this.storage.get('user-data') as unknown as IUser;

    this.loadBookingHistory();
  }

  protected loadBookingHistory() {
    this.userService
      .getAllReservationById(this.user.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          console.log(res);
          this.trips = res.data;
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });
  }

  protected payForTrip(trip: IBookingHistory, dialogRef: TemplateRef<any>) {
    this.service
      .makePayment(trip.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          showSuccess({
            title: 'Success',
            text: 'Make payment successfully',
          });

          this.loadBookingHistory();

          this.tripId = trip.id;
          this.driverId = trip.driverId;
          this.driverImage = trip.driverImage;
          this.driverName = trip.driverName;

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

  protected addReview(trip: IBookingHistory, dialogRef: TemplateRef<any>) {
    this.tripId = trip.id;
    this.driverId = trip.driverId;
    this.driverImage = trip.driverImage;
    this.driverName = trip.driverName;

    this.dialog.open(dialogRef);
  }

  protected getPickUpLocation(trip: IBookingHistory): Observable<string> {
    if (!this.pickUpLocations[trip.id]) {
      this.pickUpLocations[trip.id] = this.mapService
        .getAddress(trip.pickupLatitude, trip.pickupLongitude)
        .pipe(
          take(1),
          map((res) => res.display_name),
          untilDestroyed(this)
        );
    }

    return this.pickUpLocations[trip.id];
  }

  protected getDropOffLocation(trip: IBookingHistory): Observable<string> {
    if (!this.dropOffLocations[trip.id]) {
      this.dropOffLocations[trip.id] = this.mapService
        .getAddress(trip.dropLatitude, trip.dropLongitude)
        .pipe(
          take(1),
          map((res) => res.display_name),
          untilDestroyed(this)
        );
    }

    return this.dropOffLocations[trip.id];
  }

  protected getDriverStars(rating: number): string[] {
    const stars = [];
    const roundedRating = Math.round(rating); // Round the rating to nearest integer

    for (let i = 0; i < 5; i++) {
      stars.push(i < roundedRating ? 'filled' : 'outline');
    }

    return stars;
  }

  protected rateDriver(star: number) {
    this.selectedRating = star;
  }

  protected submitReview() {
    const rateRequest: IAddRate = {
      userID: this.user.id,
      driverID: this.driverId,
      reservationID: this.tripId,
      score: this.selectedRating,
      review: this.reviewText,
    };

    this.driverService
      .rateDriver(rateRequest)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          showSuccess({
            title: 'Rate the Driver',
            text: 'Thank you for your feedback',
          });

          this.dialog.closeAll();
          this.router.navigate(['../dashboard'], { relativeTo: this.route });
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });
  }
}
