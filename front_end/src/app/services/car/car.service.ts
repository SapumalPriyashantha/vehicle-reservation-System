import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICarRegister } from 'src/app/interface/ICarRegister';
import { IResponse } from 'src/app/interface/IResponse';
import { NON_SECURE, getEndpoint } from 'src/app/utility/constants/end-point';

@Injectable()
export class CarService {
  private baseUrl = `${getEndpoint(NON_SECURE)}`;

  constructor(private readonly httpClient: HttpClient) {}

  getAvailableCarsByDate(from: string, to: string): Observable<IResponse> {
    const params = new HttpParams().set('from', from).set('to', to);

    return this.httpClient.get<IResponse>(`${this.baseUrl}/cars/available`, {
      params,
    });
  }

  getAllCars(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(this.baseUrl + '/cars/all');
  }

  carRegister(data: ICarRegister): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.baseUrl + '/cars/add', {
      ...data,
    });
  }

  carUpdate(id: number, data: ICarRegister): Observable<IResponse> {
    return this.httpClient.put<IResponse>(
      this.baseUrl + `/cars/update/${id}`,
      {
        ...data,
      }
    );
  }

  deleteCar(id: number): Observable<IResponse> {
    return this.httpClient.delete<IResponse>(this.baseUrl + `/cars/${id}`, {});
  }

  searchCar(text: string): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.baseUrl + `/cars/search/${text}`,
      {}
    );
  }
}
