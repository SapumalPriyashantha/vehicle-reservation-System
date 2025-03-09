import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IDriver } from 'src/app/interface/IDriver';
import { ILocation } from 'src/app/interface/ILocation';
import { IResponse } from 'src/app/interface/IResponse';
import { IUser } from 'src/app/interface/IUser';
import { IUserReservation } from 'src/app/interface/IUserReservation';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DriverService } from 'src/app/services/driver/driver.service';
import { MapService } from 'src/app/services/map/map.service';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { StorageService } from 'src/app/services/storage.service';
import { showError, showSuccess } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-available-drivers',
  templateUrl: './available-drivers.component.html',
  styleUrls: ['./available-drivers.component.scss'],
})
export class AvailableDriversComponent implements OnInit {
  protected user: IUser;
  protected drivers: IDriver[] | null = [];
  protected markers: any[] | null = [];
  protected isSummary: boolean = false;
  protected location: ILocation;

  protected tripAmount: number;
  protected pickupLocation: string;
  protected dropoffLocation: string;

  constructor(
    private service: ReservationService,
    private driverService: DriverService,
    private storage: StorageService,
    private mapService: MapService,
    private authService: AuthService,
    private router: Router,
    private route:ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.user = this.storage.get('user-data') as unknown as IUser;
    this.drivers = this.driverService.getDriverPayload();
    this.markers = this.service.getMarkers();

    if (this.drivers?.length && this.markers?.length) {
      this.isSummary = true;
      this.getPickUpLocation();
      this.getDropOffLocation();
      this.calculateAmount();
    } else {
      this.isSummary = false;
      this.getCurrentLocation();
    }
  }

  protected getCurrentLocation() {
    this.authService
      .getLocation()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          this.location = res;
          this.findAvailableDrivers();
        },
      });
  }

  protected findAvailableDrivers() {
    this.driverService
      .findDrivers(this.location.lng, this.location.lat)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.drivers = res.data;
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });
  }

  protected calculateAmount() {
    this.service
      .calculateAmount(
        this.markers?.[0].position.lat,
        this.markers?.[0].position.lng,
        this.markers?.[1].position.lat,
        this.markers?.[1].position.lng
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          this.tripAmount = res.data;
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Location Fetching Failed.Try Again Later',
          });
        },
      });
  }

  protected getPickUpLocation() {
    this.mapService
      .getAddress(this.markers?.[0].position.lat, this.markers?.[0].position.lng)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          this.pickupLocation = res.display_name;
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Location Fetching Failed.Try Again Later',
          });
        },
      });
  }

  protected getDropOffLocation() {
    this.mapService
      .getAddress(this.markers?.[1].position.lat, this.markers?.[1].position.lng)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          this.dropoffLocation = res.display_name;
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Location Fetching Failed.Try Again Later',
          });
        },
      });
  }

  protected getStars(rating: number): string[] {
    const stars = [];
    const roundedRating = Math.round(rating);

    for (let i = 0; i < 5; i++) {
      stars.push(i < roundedRating ? 'filled' : 'outline');
    }

    return stars;
  }

  protected reserveDriver(driver: IDriver) {
    const reservationRequest: IUserReservation = {
      userId: this.user.id,
      driverUserName: driver.userName,
      pickupLatitude: this.markers?.[0].position.lat,
      pickupLongitude: this.markers?.[0].position.lng,
      dropLatitude: this.markers?.[1].position.lat,
      dropLongitude: this.markers?.[1].position.lng,
    };

    this.service
      .makeUserReservation(reservationRequest)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          showSuccess({
            title: 'Success',
            text: 'Reservation Successfully',
          });

          this.driverService.setDriverPayload(null);
          this.service.setMarkers(null);
          this.router.navigate(['../booking-history'],{relativeTo:this.route});
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
