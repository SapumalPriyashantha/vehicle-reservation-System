import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DriverStatus } from 'src/app/enums/DriverStatus.enum';
import { IDriver } from 'src/app/interface/IDriver';
import { IResponse } from 'src/app/interface/IResponse';
import { DriverService } from 'src/app/services/driver/driver.service';
import { StorageService } from 'src/app/services/storage.service';
import { showError, showSuccess } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-status-toggle',
  templateUrl: './status-toggle.component.html',
  styleUrls: ['./status-toggle.component.scss'],
})
export class StatusToggleComponent implements OnInit {
  protected status: boolean;
  protected currentStatus: DriverStatus;
  protected driver: IDriver;

  protected today: number;
  protected week: number;
  protected month: number;

  ongoingTrip: any;

  tripRequests = [
    {
      pickupLocation: '123 Main St',
      dropoffLocation: '456 Oak Ave',
      distance: 10,
      estimatedFare: 20.5,
    },
    {
      pickupLocation: '789 Pine St',
      dropoffLocation: '101 Maple Dr',
      distance: 8,
      estimatedFare: 18.0,
    },
  ];

  earnings = {
    today: 100,
    week: 500,
    month: 2000,
  };

  constructor(
    private service: DriverService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.driver = this.storage.get('driver-data') as unknown as IDriver;
    this.currentStatus = this.driver.status;
    this.currentStatus === DriverStatus.AVAILABLE
      ? (this.status = true)
      : (this.status = false);
    this.loadEarningsData();
  }

  protected loadEarningsData() {
    this.service
      .dailyIncome(this.driver.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.today = res.data;
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });

    this.service
      .weeklyIncome(this.driver.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.today = res.data;
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });

    this.service
      .monthlyIncome(this.driver.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.today = res.data;
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });
  }

  onStatusChange(event: any) {
    this.currentStatus = this.status
      ? DriverStatus.AVAILABLE
      : DriverStatus.BUSY;
    this.service
      .changeStatus(this.driver.id, this.currentStatus)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          showSuccess({
            title: 'Success',
            text: 'Your status changed successfully',
          });
          this.driver = { ...this.driver, status:this.currentStatus };
          this.storage.set('driver-data', this.driver);
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
