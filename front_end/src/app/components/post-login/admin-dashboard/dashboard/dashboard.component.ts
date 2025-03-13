import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ReservationStatus } from 'src/app/enums/ReservationStatus.enum';
import { ICompleteBooking } from 'src/app/interface/ICompleteBooking';
import { IResponse } from 'src/app/interface/IResponse';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { showError } from 'src/app/utility/helper';

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

  protected recentPayments: ICompleteBooking[] = [];

  constructor(private service: ReservationService) {}

  ngOnInit(): void {
    this.loadSummaryData();
  }

  protected loadSummaryData(): void {
    this.service
      .getAdminDashboardData()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.recentPayments = res.data.lastCompletedBookings;
          this.ongoingTrips = res.data.ongoingTrips;
          this.totalDrivers = res.data.activeDrivers;
          this.totalPassengers = res.data.activePassengers;
          this.totalRevenue = res.data.totalRevenue;
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
