import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class MapService {
  constructor(private httpClient: HttpClient) {}

  getAddress(lat: number, lng: number): Observable<any> {
    return this.httpClient.get<any>(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
  }

  searchLocations(query: string): Observable<any> {
    return this.httpClient.get<any[]>(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
  }
}
