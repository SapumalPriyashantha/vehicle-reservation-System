import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/interface/IResponse';
import { NON_SECURE, getEndpoint } from 'src/app/utility/constants/end-point';

@Injectable()
export class CarService {
  private baseUrl = `${getEndpoint(NON_SECURE)}`;

  constructor(private readonly httpClient: HttpClient) {}

  getAvailableCarsByDate(from: string, to: string): Observable<IResponse> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);

    return this.httpClient.get<IResponse>(`${this.baseUrl}/cars/available`, { params });
  }
}
