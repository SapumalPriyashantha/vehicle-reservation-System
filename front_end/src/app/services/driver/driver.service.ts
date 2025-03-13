import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DriverStatus } from 'src/app/enums/DriverStatus.enum';
import { IDriver } from 'src/app/interface/IDriver';
import { IResponse } from 'src/app/interface/IResponse';
import { NON_SECURE, getEndpoint } from 'src/app/utility/constants/end-point';

@Injectable()
export class DriverService {
  private baseUrl = `${getEndpoint(NON_SECURE)}`;
  private driverListPayload: IDriver[] | null = [];

  constructor(private readonly httpClient: HttpClient) {}

  getAllDrivers(status: DriverStatus): Observable<IResponse> {
    const params = { driverStatus: status };
    return this.httpClient.get<IResponse>(this.baseUrl + '/admin/drivers', {
      params,
    });
  }

  getBookingsByDriver(id: number, status: string): Observable<IResponse> {
    const params = { driverId: id, status: status };
    return this.httpClient.get<IResponse>(
      this.baseUrl + '/bookings/bookingsByDriver',
      {
        params,
      }
    );
  }

  startTrip(id: number): Observable<IResponse> {
    return this.httpClient.put<IResponse>(
      this.baseUrl + `/bookings/start/${id}`,
      {}
    );
  }

  endTrip(id: number, km: number, amount: 200): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.baseUrl + '/payment/process', {
      bookingId: id,
      kilometers: km,
      extraAmount: amount,
    });
  }

  driverSummaryDashboard(id: number): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.baseUrl + `/payment/earnings/${id}`,
      {}
    );
  }
}
