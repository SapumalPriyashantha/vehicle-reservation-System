import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { ScreenLoaderService } from '../services/screen-loader/screen-loader.service';

@Injectable()
export class Interceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(
    private authService: AuthService,
    private storage: StorageService,
    private screenLoader: ScreenLoaderService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.totalRequests++;
    this.screenLoader.setLoading(true);

    const token = this.storage.get('token');
    let authReq = request;

    if (token) {
      authReq = request.clone({
        setHeaders: {
          'Access-Control-Allow-Origin':'true',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.screenLoader.setLoading(false);
        }
      })
    );
  }
}
