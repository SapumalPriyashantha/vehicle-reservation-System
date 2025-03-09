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

  customerRegister(data: IUserRegister): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.baseUrl + '/user/register', {
      ...data,
      role: 'USER',
    });
  }

  updateCustomer(id:number,data: IUserRegister): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.baseUrl + '/user/update', {
      ...data,
      id:id
    });
  }

  getUserCount(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(this.baseUrl + '/admin/fullUserCount');
  }

  getAllActiveUsers(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(this.baseUrl + '/user/allUsers');
  }

  searchUser(text:string): Observable<IResponse> {
    const params = { name:text};
    return this.httpClient.get<IResponse>(this.baseUrl + '/user/search', {
      params,
    });
  }

  deleteUser(id: number): Observable<IResponse> {
    const params = { userID: id };
    return this.httpClient.delete<IResponse>(this.baseUrl + '/user', {
      params,
    });
  }

  getLast5ReservationById(id: number): Observable<IResponse> {
    const params = { userID: id };
    return this.httpClient.get<IResponse>(this.baseUrl + '/user/reservation', { params });
  }

  getAllReservationById(id: number): Observable<IResponse> {
    const params = { userID: id };
    return this.httpClient.get<IResponse>(this.baseUrl + '/user/allReservation', { params });
  }

  changePassword(data: IChangePassword): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.baseUrl + '/user/changePassword', {
      ...data,
    });
  }

}
