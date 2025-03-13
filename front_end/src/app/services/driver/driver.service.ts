import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DriverStatus } from 'src/app/enums/DriverStatus.enum';
import { IAddRate } from 'src/app/interface/IAddRate';
import { IChangePassword } from 'src/app/interface/IChangePassword';
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

  // ----------

  setDriverPayload(drivers: IDriver[] | null) {
    this.driverListPayload = drivers;
  }

  getDriverPayload() {
    return this.driverListPayload;
  }

  getDriverById(id: number): Observable<IResponse> {
    const params = { id: id };
    return this.httpClient.get<IResponse>(this.baseUrl + '/driver', { params });
  }

  deleteDriver(id: number): Observable<IResponse> {
    const params = { driverID: id };
    return this.httpClient.delete<IResponse>(this.baseUrl + '/driver', {
      params,
    });
  }

  searchDriver(text: string): Observable<IResponse> {
    const params = { name: text };
    return this.httpClient.get<IResponse>(this.baseUrl + '/driver/search', {
      params,
    });
  }

  findDrivers(lng: number, lat: number): Observable<IResponse> {
    const params = { userLatitude: lat, userLongitude: lng };
    return this.httpClient.get<IResponse>(
      this.baseUrl + '/driver/nearestDrivers',
      {
        params,
      }
    );
  }

  getDriverCount(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.baseUrl + '/admin/fullDriverCount'
    );
  }

  weeklyIncome(id: number): Observable<IResponse> {
    const params = { driverID: id };
    return this.httpClient.get<IResponse>(
      this.baseUrl + '/driver/weeklyIncome',
      {
        params,
      }
    );
  }

  monthlyIncome(id: number): Observable<IResponse> {
    const params = { driverID: id };
    return this.httpClient.get<IResponse>(
      this.baseUrl + '/driver/monthlyIncome',
      {
        params,
      }
    );
  }

  getAllReservationById(id: number): Observable<IResponse> {
    const params = { driverID: id };
    return this.httpClient.get<IResponse>(
      this.baseUrl + '/driver/allReservation',
      {
        params,
      }
    );
  }

  changePassword(data: IChangePassword): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.baseUrl + '/driver/changePassword',
      {
        ...data,
      }
    );
  }
}
