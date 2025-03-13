import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DriverStatus } from 'src/app/enums/DriverStatus.enum';
import { IDriver } from 'src/app/interface/IDriver';
import { IResponse } from 'src/app/interface/IResponse';
import { IUser } from 'src/app/interface/IUser';
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
  protected driver: IUser;

  protected today: number;
  protected week: number;
  protected month: number;

  constructor(
    private service: DriverService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.driver = this.storage.get('driver-data') as unknown as IUser;
    this.loadEarningsData();
  }

  protected loadEarningsData() {
    this.service
      .driverSummaryDashboard(this.driver.userId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.today = res.data.todayEarnings;
          this.week = res.data.weekEarnings;
          this.month = res.data.monthEarnings;
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
