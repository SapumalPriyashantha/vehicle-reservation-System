import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interface/IResponse';
import { DriverService } from 'src/app/services/driver/driver.service';
import { StorageService } from 'src/app/services/storage.service';
import { showError, showQuestion, showSuccess } from 'src/app/utility/helper';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationStatus } from 'src/app/enums/ReservationStatus.enum';
import { IUser } from 'src/app/interface/IUser';
import { HttpErrorResponse } from '@angular/common/http';
import { IBookingHistory } from 'src/app/interface/IBookingHistory';

@UntilDestroy()
@Component({
  selector: 'app-current-trip',
  templateUrl: './current-trip.component.html',
  styleUrls: ['./current-trip.component.scss'],
})
export class CurrentTripComponent implements OnInit {
  protected ReservationStatus = ReservationStatus;
  protected selectedStatus: string;
  protected driver: IUser;

  protected trips: IBookingHistory[] = [];

  constructor(
    private service: DriverService,
    private storage: StorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.selectedStatus = ReservationStatus.PENDING;
  }

  ngOnInit(): void {
    this.driver = this.storage.get('driver-data') as unknown as IUser;
    this.loadBookingHistory();
  }

  protected loadBookingHistory() {
    this.service
      .getBookingsByDriver(this.driver.userId, this.selectedStatus)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.trips = res.data;
        },
        error: (err: HttpErrorResponse) => {
          this.trips = [];
          if (err.error.code === 400) {
            showError({
              title: 'System Error',
              text: err.error.data,
            });
          } else {
            showError({
              title: 'System Error',
              text: 'Something Went Wrong',
            });
          }
        },
      });
  }

  protected startTrip(id: number) {
    showQuestion(
      {
        title: 'Start Trip',
        text: 'Are you sure,You want to start this trip?',
      },
      (isConfirmed) => {
        if (isConfirmed) {
          this.service
            .startTrip(id)
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res: IResponse) => {
                showSuccess({
                  title: 'Success',
                  text: 'Trip Start successfully',
                });

                this.selectedStatus = ReservationStatus.ONGOING;
                this.loadBookingHistory();
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
    );
  }

  protected endTrip(id: number) {
    showQuestion(
      {
        title: 'End Trip',
        text: 'Have you arrived at your destination?',
      },
      (isConfirmed) => {
        if (isConfirmed) {
          this.service
            .endTrip(id, 10, 200)
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res: IResponse) => {
                showSuccess({
                  title: 'Success',
                  text: 'Trip complete successfully',
                });

                this.selectedStatus = ReservationStatus.COMPLETED;
                this.loadBookingHistory();
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
    );
  }
}
