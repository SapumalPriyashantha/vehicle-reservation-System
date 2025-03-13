import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { ICar } from 'src/app/interface/ICar';
import { IResponse } from 'src/app/interface/IResponse';
import { IUser } from 'src/app/interface/IUser';
import { IUserReservation } from 'src/app/interface/IUserReservation';
import { CarService } from 'src/app/services/car/car.service';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { StorageService } from 'src/app/services/storage.service';
import { showError, showQuestion, showSuccess } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-reserve-taxi',
  templateUrl: './reserve-taxi.component.html',
  styleUrls: ['./reserve-taxi.component.scss'],
})
export class ReserveTaxiComponent implements OnInit {
  protected form: FormGroup;
  protected carList: ICar[] = [];

  constructor(
    private fb: FormBuilder,
    protected carService: CarService,
    protected service: ReservationService,
    protected storageService: StorageService,
    private router: Router,
    protected route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      fromDate: [moment(), Validators.required],
      toDate: [moment(), Validators.required],
      pickupLocation: ['', Validators.required],
      destination: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.searchAvailableCars();
  }

  protected searchAvailableCars() {
    const { fromDate, toDate } = this.form.value;

    const from = moment(fromDate).format('YYYY-MM-DDTHH:mm:ss');
    const to = moment(toDate).format('YYYY-MM-DDTHH:mm:ss');

    this.carService
      .getAvailableCarsByDate(from, to)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.carList = res.data;
        },
        error: (err: HttpErrorResponse) => {
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

  protected reserveCar(car: ICar) {
    const { fromDate, toDate, pickupLocation, destination } = this.form.value;
    const user = this.storageService.get('user-data') as unknown as IUser;

    const from = moment(fromDate).format('YYYY-MM-DDTHH:mm:ss');
    const to = moment(toDate).format('YYYY-MM-DDTHH:mm:ss');

    const bookingRequest: IUserReservation = {
      customerId: user.userId,
      carId: car.carId,
      pickupLocation: pickupLocation,
      destination: destination,
      startTime: from,
      endTime: to,
    };

    showQuestion(
      {
        title: 'Reserve Cab',
        text: 'Are you really want to reserve this vehicle ?',
      },
      (isConfirmed) => {
        if (isConfirmed) {
          this.service
            .makeUserReservation(bookingRequest)
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res: IResponse) => {
                showSuccess({
                  title: 'Success',
                  text: 'Reservation Successfully',
                });
                this.searchAvailableCars();
              },
              error: (err: HttpErrorResponse) => {
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
      }
    );
  }
}
