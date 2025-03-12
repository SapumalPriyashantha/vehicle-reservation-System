import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAddRate } from 'src/app/interface/IAddRate';
import { IAdminReservation } from 'src/app/interface/IAdminReservation';
import { IResponse } from 'src/app/interface/IResponse';
import { IUserReservation } from 'src/app/interface/IUserReservation';
import { NON_SECURE, getEndpoint } from 'src/app/utility/constants/end-point';

@Injectable()
export class ReservationService {
  private baseUrl = `${getEndpoint(NON_SECURE)}`;
  protected markers: any[] | null = [];

  constructor(private readonly httpClient: HttpClient) {}

  makeUserReservation(data: IUserReservation): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.baseUrl + '/bookings/createBooking', {
      ...data,
    });
  }

  submitFeedback(data: IAddRate): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.baseUrl + '/feedback/submit-feedback', {
      ...data,
    });
  }


// ---------

  setMarkers(markers: any[] | null) {
    this.markers = markers;
  }

  getMarkers() {
    return this.markers;
  }

  makeAdminReservation(data: IAdminReservation): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.baseUrl + '/admin/reserve', {
      ...data,
    });
  }

  makePayment(reservationId: number): Observable<IResponse> {
    const params = { reservationId: reservationId.toString() };
    return this.httpClient.get<IResponse>(this.baseUrl + '/user/pay', {
      params,
    });
  }

  getAllOngoingTripCount(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(this.baseUrl + '/admin/onGoingTrips');
  }

  getFullTotalIncome(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.baseUrl + '/admin/fullTotalAmount'
    );
  }

  getLast5Reservations(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(this.baseUrl + '/admin/reservations');
  }

  calculateAmount(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number
  ): Observable<IResponse> {
    const params = {
      latitude1: fromLat,
      longitude1: fromLng,
      latitude2: toLat,
      longitude2: toLng,
    };
    return this.httpClient.get<IResponse>(this.baseUrl + '/user/getAmount', {
      params,
    });
  }

  getCurrentOngoingTrip(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.baseUrl + '/reserve/currentOngoingTrip'
    );
  }

  getPaymentDetails(from: string, to: string): Observable<IResponse> {
    const params = {
      fromDate: from,
      toDate: to,
    };
    return this.httpClient.get<IResponse>(
      this.baseUrl + '/admin/paymentDetails',
      {
        params,
      }
    );
  }
}
