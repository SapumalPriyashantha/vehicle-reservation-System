import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IChangePassword } from 'src/app/interface/IChangePassword';
import { IResponse } from 'src/app/interface/IResponse';
import { IUserRegister } from 'src/app/interface/IUserRegister';
import { NON_SECURE, getEndpoint } from 'src/app/utility/constants/end-point';

@Injectable()
export class CustomerService {
  private baseUrl = `${getEndpoint(NON_SECURE)}`;

  constructor(private readonly httpClient: HttpClient) {}

  getAllBookingsByCustomerId(
    id: number,
    status: string
  ): Observable<IResponse> {
    const params = { customerId: id, status: status };
    return this.httpClient.get<IResponse>(
      this.baseUrl + '/bookings/bookingsByCustomer',
      { params }
    );
  }

  customerRegister(data: IUserRegister): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.baseUrl + '/users/register', {
      ...data,
      role: 'CUSTOMER',
    });
  }

  updateCustomer(id: number, data: IUserRegister): Observable<IResponse> {
    return this.httpClient.put<IResponse>(this.baseUrl + `/users/${id}`, {
      ...data,
    });
  }

  changePassword(data: IChangePassword): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.baseUrl + '/users/changePassword',
      {
        ...data,
      }
    );
  }

  searchUser(text: string): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.baseUrl + `/users/search/${text}`,
      {}
    );
  }

  getAllActiveUsers(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(this.baseUrl + '/users/all');
  }

  deleteUser(id: number): Observable<IResponse> {
    const params = { userID: id };
    return this.httpClient.delete<IResponse>(this.baseUrl + `/users/${id}`, {
      params,
    });
  }

  deleteDriver(id: number): Observable<IResponse> {
    const params = { userID: id };
    return this.httpClient.delete<IResponse>(
      this.baseUrl + `/drivers/${id}`,
      {}
    );
  }

  driverRegister(data: IUserRegister): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.baseUrl + '/drivers/register', {
      ...data,
    });
  }

  driverUpdate(id: number, data: IUserRegister): Observable<IResponse> {
    return this.httpClient.put<IResponse>(this.baseUrl + `/drivers/${id}`, {
      ...data,
    });
  }

  getLast5ReservationById(id: number): Observable<IResponse> {
    const params = { userID: id };
    return this.httpClient.get<IResponse>(
      this.baseUrl + `/bookings/last-trips/${id}`,
      {}
    );
  }

  // ---------------

  getUserCount(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.baseUrl + '/admin/fullUserCount'
    );
  }
}
