import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScreenLoaderService {
  public isLoading = new BehaviorSubject<boolean>(false);

  constructor() {}

  setLoading(isLoading: boolean) {
    this.isLoading.next(isLoading);
  }
}
