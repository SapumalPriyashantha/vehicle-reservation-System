import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ReservationStatus } from 'src/app/enums/ReservationStatus.enum';
import { IBookingHistory } from 'src/app/interface/IBookingHistory';
import { ILastTrip } from 'src/app/interface/ILastTrip';
import { IResponse } from 'src/app/interface/IResponse';
import { IUser } from 'src/app/interface/IUser';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { StorageService } from 'src/app/services/storage.service';
import { showError } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  protected user:IUser;
  protected latestsBookings:ILastTrip[]=[];

  constructor(
    private service: ReservationService,
    private customerService:CustomerService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.user = this.storage.get('user-data') as unknown as IUser;
   
    this.loadSummary();
  }

  protected loadSummary() {
    this.customerService.getLast5ReservationById(this.user.userId).pipe(untilDestroyed(this)).subscribe({
      next: (res: IResponse) => {
        this.latestsBookings = res.data;
      },
      error: () => {
        showError({
          title: 'System Error',
          text: 'Something Went Wrong',
        });
      },
    })
  }

  
  
}
