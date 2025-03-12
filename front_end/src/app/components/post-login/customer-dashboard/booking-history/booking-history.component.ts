import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ReservationStatus } from 'src/app/enums/ReservationStatus.enum';
import { IAddRate } from 'src/app/interface/IAddRate';
import { IBookingHistory } from 'src/app/interface/IBookingHistory';
import { IResponse } from 'src/app/interface/IResponse';
import { IUser } from 'src/app/interface/IUser';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { StorageService } from 'src/app/services/storage.service';
import { showError, showSuccess } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.scss'],
})
export class BookingHistoryComponent implements OnInit {
  protected user: IUser;
  protected driver: IUser;
  protected tripID:number;
  protected selectedStatus: string;

  protected trips: IBookingHistory[] = [];
  protected selectedRating: number = 0;

  protected reviewText: string;
  protected ReservationStatus = ReservationStatus;

  constructor(
    private dialog: MatDialog,
    private service: ReservationService,
    private storage: StorageService,
    private userService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.selectedStatus = ReservationStatus.COMPLETED;
  }

  ngOnInit(): void {
    this.user = this.storage.get('user-data') as unknown as IUser;
    this.loadBookingHistory();
  }

  protected loadBookingHistory() {
    this.userService
      .getAllBookingsByCustomerId(this.user.userId, this.selectedStatus)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.trips = res.data;
        },
        error: () => {
          this.trips = [];
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });
  }

  protected addReview(trip: IBookingHistory, dialogRef: TemplateRef<any>) {
    this.driver = trip.driver;
    this.tripID = trip.bookingId;
    this.dialog.open(dialogRef);
  }

  protected getDriverStars(rating: number): string[] {
    const stars = [];
    const roundedRating = Math.round(rating); // Round the rating to nearest integer

    for (let i = 0; i < 5; i++) {
      stars.push(i < roundedRating ? 'filled' : 'outline');
    }

    return stars;
  }

  protected rateDriver(star: number) {
    this.selectedRating = star;
  }

  protected submitReview() {
    const rateRequest: IAddRate = {
      bookingId: this.tripID,
      rating: this.selectedRating,
      comments: this.reviewText
    };

    this.service
      .submitFeedback(rateRequest)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          showSuccess({
            title: 'Submit Feedback',
            text: 'Thank you for your feedback',
          });

          this.dialog.closeAll();
          this.router.navigate(['../dashboard'], { relativeTo: this.route });
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
