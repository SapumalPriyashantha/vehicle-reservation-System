import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILocation } from 'src/app/interface/ILocation';
import { ILogin } from 'src/app/interface/ILogin';
import { IResponse } from 'src/app/interface/IResponse';
import { NON_SECURE, getEndpoint } from 'src/app/utility/constants/end-point';
import { showError } from 'src/app/utility/helper';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${getEndpoint(NON_SECURE)}`;

  constructor(private readonly httpClient: HttpClient) {}

  userLogin(data: ILogin): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.baseUrl + '/users/login', {
      ...data,
    });
  }

  driverLogin(data: ILogin): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.baseUrl + '/driver/login', {
      ...data,
    });
  }

  getLocation(): Observable<ILocation> {
    return new Observable<ILocation>((ob) => {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          ob.next({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          ob.complete();
        },
        (err) => {
          showError(
            {
              title:'Location Required',
              html: 'Please enable location permission and reload page to proceed',
              confirmButtonText: 'Reload',
            },
            () => location.reload()
          );
          ob.error(err);
        }
      );
    });
  }
}
