import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  CanMatch,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanMatch {
  constructor(private router: Router, private service: StorageService) {}

  canMatch(
    route: Route,
    segments: UrlSegment[]
  ): boolean | Observable<boolean> {
    const isAdmin = this.service.get('admin-data');
    const isDriver = this.service.get('driver-data');
    const isCustomer = this.service.get('user-data');

    if (!isAdmin && !isDriver && !isCustomer) {
      this.router.navigate(['/login']);
      return false; 
    } else {
      return true;
    }
  }
}
