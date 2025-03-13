import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAddRate } from 'src/app/interface/IAddRate';
import { IResponse } from 'src/app/interface/IResponse';
import { IUserReservation } from 'src/app/interface/IUserReservation';
import { NON_SECURE, getEndpoint } from 'src/app/utility/constants/end-point';

@Injectable()
export class ReservationService {
  private baseUrl = `${getEndpoint(NON_SECURE)}`;
  protected markers: any[] | null = [];

  constructor(private readonly httpClient: HttpClient) {}

  makeUserReservation(data: IUserReservation): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.baseUrl + '/bookings/createBooking',
      {
        ...data,
      }
    );
  }

  submitFeedback(data: IAddRate): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.baseUrl + '/feedback/submit-feedback',
      {
        ...data,
      }
    );
  }

  getAdminDashboardData(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.baseUrl + '/bookings/AdminDashboard',
      {}
    );
  }

  getPaymentDetails(from: string, to: string): Observable<IResponse> {
    const params = {
      from: from,
      to: to,
    };
    return this.httpClient.get<IResponse>(this.baseUrl + '/payment/report', {
      params,
    });
  }

  getBookingOverview(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(this.baseUrl + '/bookings/all');
  }
}
