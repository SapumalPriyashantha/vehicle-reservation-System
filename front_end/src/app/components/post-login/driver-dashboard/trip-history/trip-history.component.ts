import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IDriver } from 'src/app/interface/IDriver';
import { ITrip } from 'src/app/interface/ITrip';
import { IResponse } from 'src/app/interface/IResponse';
import { DriverService } from 'src/app/services/driver/driver.service';
import { StorageService } from 'src/app/services/storage.service';
import { showError } from 'src/app/utility/helper';
import { MapService } from 'src/app/services/map/map.service';
import { Observable, map, switchMap, take } from 'rxjs';
import { UserRoles } from 'src/app/enums/UserRoles.enum';
import { ReservationStatus } from 'src/app/enums/ReservationStatus.enum';

@UntilDestroy()
@Component({
  selector: 'app-trip-history',
  templateUrl: './trip-history.component.html',
  styleUrls: ['./trip-history.component.scss'],
})
export class TripHistoryComponent implements OnInit {
  protected UserRoles = UserRoles;
  protected driver: IDriver;
  protected trips: ITrip[] = [];

  protected pickUpLocations: { [tripId: string]: Observable<string> } = {};
  protected dropOffLocations: { [tripId: string]: Observable<string> } = {};

  constructor(
    private service: DriverService,
    private storage: StorageService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.driver = this.storage.get('driver-data') as unknown as IDriver;
    this.service
      .getAllReservationById(this.driver.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.trips = res.data.filter(
            (x: ITrip) => x.status === ReservationStatus.END
          );
        },
        error: () => {
          showError({
            title: 'Trip History',
            text: 'Your trip history is empty',
          });
        },
      });
  }

  protected getPickUpLocation(trip: ITrip): Observable<string> {
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

  protected getDropOffLocation(trip: ITrip): Observable<string> {
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

  protected getStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? 'filled' : 'outline');
    }
    return stars;
  }

  protected getGoogleMapsUrl(trip: any) {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${trip.pickupLatitude},${trip.pickupLongitude}&destination=${trip.dropoffLatitude},${trip.dropoffLongitude}`;

    window.open(url, '_blank');
  }
}
