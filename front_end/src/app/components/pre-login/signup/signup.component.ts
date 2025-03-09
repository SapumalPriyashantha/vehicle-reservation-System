import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { showError, showSuccess } from 'src/app/utility/helper';
import { IResponse } from 'src/app/interface/IResponse';

@UntilDestroy()
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  protected form: FormGroup;

  constructor(
    private readonly service: CustomerService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  protected onSubmit() {
    if (this.form.valid) {
      this.service
        .customerRegister(this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (res: IResponse) => {
            showSuccess({
              title: 'Success',
              text: 'User Creation Successful',
            });
            this.router.navigate(['/login']);
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
