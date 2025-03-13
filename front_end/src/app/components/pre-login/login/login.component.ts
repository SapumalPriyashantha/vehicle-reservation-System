import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserRoles } from 'src/app/enums/UserRoles.enum';
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
export class LoginComponent{
  protected loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AuthService,
    private storage: StorageService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  protected onSubmit() {
    if (this.loginForm.valid) {
      this.service
        .userLogin(this.loginForm.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (res: IResponse) => {
            if (res.status === 'SUCCESS') {
              if (res.data.role === UserRoles.CUSTOMER) {
                this.storage.set('user-data', res.data);
                this.router.navigate(['post-login/customer-dashboard']);

              } else if (res.data.role === UserRoles.DRIVER) {
                this.storage.set('driver-data', res.data);
                this.router.navigate(['post-login/driver-dashboard']);

              } else if (res.data.role === UserRoles.ADMIN) {
                this.storage.set('admin-data', res.data);
                this.router.navigate(['post-login/admin-dashboard']);

              }
            } else {
              showError({
                title: 'System Error',
                text: 'Something went wrong',
              });
            }
          },
          error: (err: HttpErrorResponse) => {
            showError({
              title: 'System Error',
              text: err.error.data,
            });
          },
        });
    }
  }
}
