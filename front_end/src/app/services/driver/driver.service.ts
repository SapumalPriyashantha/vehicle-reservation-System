import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DriverStatus } from 'src/app/enums/DriverStatus.enum';
import { IAddRate } from 'src/app/interface/IAddRate';
import { IChangePassword } from 'src/app/interface/IChangePassword';
import { IDriver } from 'src/app/interface/IDriver';
import { IDriverRegister } from 'src/app/interface/IDriverRegister';
import { IResponse } from 'src/app/interface/IResponse';
import { NON_SECURE, getEndpoint } from 'src/app/utility/constants/end-point';

@Injectable()
export class DriverService {
  private baseUrl = `${getEndpoint(NON_SECURE)}`;
  private driverListPayload: IDriver[] | null = [];

  constructor(private readonly httpClient: HttpClient) {}

  setDriverPayload(drivers:IDriver[] | null){
    this.driverListPayload = drivers;
  }

  getDriverPayload(){
    return this.driverListPayload;
  }

  driverRegister(data: IDriverRegister): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.baseUrl + '/admin/register', {
      ...data,
    });
  }

  driverUpdate(id: number, data: IDriverRegister): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.baseUrl + '/driver/update', {
      ...data,
      id: id,
    });
  }

  getAllDrivers(status: DriverStatus): Observable<IResponse> {
    const params = { driverStatus: status };
    return this.httpClient.get<IResponse>(this.baseUrl + '/admin/drivers', {
      params,
    });
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

  rateDriver(data: IAddRate): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.baseUrl + '/user/rate', {
      ...data,
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

  getLast5ReservationById(id: number): Observable<IResponse> {
    const params = { driverID: id };
    return this.httpClient.get<IResponse>(
      this.baseUrl + '/driver/reservation',
      { params }
    );
  }

  getDriverCount(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.baseUrl + '/admin/fullDriverCount'
    );
  }

  changeStatus(id: number, status: DriverStatus): Observable<IResponse> {
    const params = { driverID: id, status: status };
    return this.httpClient.get<IResponse>(
      this.baseUrl + '/driver/updateStatus',
      {
        params,
      }
    );
  }

  dailyIncome(id: number): Observable<IResponse> {
    const params = { driverID: id };
    return this.httpClient.get<IResponse>(
      this.baseUrl + '/driver/dailyIncome',
      {
        params,
      }
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

  ongoingTripWithId(id: number): Observable<IResponse> {
    const params = { driverID: id };
    return this.httpClient.get<IResponse>(
      this.baseUrl + '/driver/ongoingTrip',
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
    return this.httpClient.post<IResponse>(this.baseUrl + '/driver/changePassword', {
      ...data,
    });
  }
}
