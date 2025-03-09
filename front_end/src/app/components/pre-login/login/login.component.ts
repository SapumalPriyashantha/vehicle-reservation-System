import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserRoles } from 'src/app/enums/UserRoles.enum';
import { ILocation } from 'src/app/interface/ILocation';
import { ILogin } from 'src/app/interface/ILogin';
import { IResponse } from 'src/app/interface/IResponse';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { showError } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  protected loginForm: FormGroup;
  protected location: ILocation;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AuthService,
    private storage: StorageService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
      role: ['User', Validators.required],
    });
  }

  ngOnInit(): void {
    this.service
      .getLocation()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          this.location = res;
        },
      });
  }

  protected onSubmit() {
    if (this.loginForm.valid) {
      const { role, username, password } = this.loginForm.value;
      const loginRequest: ILogin = {
        userName: username,
        password: password,
        longitude: this.location.lng,
        latitude: this.location.lat,
      };
      if (role === 'User') {
        this.service
          .userLogin(loginRequest)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: IResponse) => {
              if (res.data.userDto.role === UserRoles.USER) {
                this.storage.set('user-data', res.data.userDto);
                this.router.navigate(['post-login/customer-dashboard']);
              } else {
                this.storage.set('admin-data', res.data.userDto);
                this.router.navigate(['post-login/admin-dashboard']);
              }
            },
            error: (err: HttpErrorResponse) => {
              showError({
                title: 'System Error',
                text: 'Something Went Wrong',
              });
            },
          });
      } else {
        this.service
          .driverLogin(loginRequest)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: IResponse) => {
              this.storage.set('driver-data', res.data);
              this.router.navigate(['post-login/driver-dashboard']);
            },
            error: (err: HttpErrorResponse) => {
              showError({
                title: 'System Error',
                text: 'Something Went Wrong',
              });
            },
          });
      }
    }
  }
}
