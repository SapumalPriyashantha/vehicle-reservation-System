import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, map, take } from 'rxjs';
import { IBookingHistory } from 'src/app/interface/IBookingHistory';
import { IResponse } from 'src/app/interface/IResponse';
import { ITrip } from 'src/app/interface/ITrip';
import { MapService } from 'src/app/services/map/map.service';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { showError } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-booking-overview',
  templateUrl: './booking-overview.component.html',
  styleUrls: ['./booking-overview.component.scss'],
})
export class BookingOverviewComponent implements OnInit {
  protected displayedColumns: string[] = [
    'driverName',
    'driverMobile',
    'clientName',
    'pickupLocation',
    'dropoffLocation',
    'payment',
  ];

  protected pickUpLocations: { [tripId: string]: Observable<string> } = {};
  protected dropOffLocations: { [tripId: string]: Observable<string> } = {};

  protected ongoingTrips : ITrip[]=[];

  constructor(private service: ReservationService,private mapService:MapService) {

  }

  ngOnInit(): void {
    this.loadOngoingTripData()
  }

  protected loadOngoingTripData() {
    this.service.getCurrentOngoingTrip().pipe(untilDestroyed(this)).subscribe({
      next: (res: IResponse) => {
        this.ongoingTrips = res.data;
      },
      error: () => {
        showError({
          title: 'System Error',
          text: 'Something Went Wrong',
        });
      },
    })
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

}
