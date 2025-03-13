import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IBookingHistory } from 'src/app/interface/IBookingHistory';
import { IResponse } from 'src/app/interface/IResponse';
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
    'ID',
    'driverName',
    'driverMobile',
    'clientName',
    'pickupLocation',
    'dropoffLocation',
    'status',
  ];

  protected trips: IBookingHistory[] = [];

  constructor(private service: ReservationService) {}

  ngOnInit(): void {
    this.loadTripOverview();
  }

  protected loadTripOverview() {
    this.service
      .getBookingOverview()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
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
}
