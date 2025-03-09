import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IChangePassword } from 'src/app/interface/IChangePassword';
import { IResponse } from 'src/app/interface/IResponse';
import { IUser } from 'src/app/interface/IUser';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { StorageService } from 'src/app/services/storage.service';
import { showError, showSuccess } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss'],
})
export class SystemSettingsComponent implements OnInit {
  protected isEditing = false;
  protected settingsForm: FormGroup;
  protected passwordForm: FormGroup;

  protected admin: IUser;

  constructor(
    private fb: FormBuilder,
    private storage: StorageService,
    private service: CustomerService,
    private router:Router
  ) {
    this.settingsForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      mobileNumber: ['', Validators.required],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.admin = this.storage.get('admin-data') as unknown as IUser;

    this.settingsForm.patchValue({
      name: this.admin.name,
      email: this.admin.email,
      mobileNumber: this.admin.mobileNumber,
    });
  }

  onEditClick() {
    this.isEditing = true;
  }

  protected onSaveClick() {
    if (this.settingsForm.valid) {
      this.service
        .updateCustomer(this.admin.id, this.settingsForm.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (res: IResponse) => {
            showSuccess({
              title: 'Success',
              text: 'Your details updated successfully',
            });
            this.isEditing = false;
            this.admin = { ...this.admin, ...this.settingsForm.value };
            this.storage.set('admin-data', this.admin);
          },
          error: () => {
            showError({
              title: 'System Error',
              text: 'Something Went Wrong',
            });
          },
        });
    }
  }

  protected onChangePasswordClick() {
    const { newPassword, confirmPassword, currentPassword } =
      this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      showError({
        title: 'Verification Error',
        text: 'Password does not match.Try Again',
      });
      return;
    }

    const changePasswordRequest: IChangePassword = {
      id: this.admin.id,
      currentPassword: currentPassword,
      newPassword: newPassword,
    };
    this.service
      .changePassword(changePasswordRequest)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          showSuccess({
            title: 'Success',
            text: 'Password Change Successfully.Please Login again',
          });

          this.storage.clearAll();
          this.router.navigate(['/login']);
        },
        error: (err: HttpErrorResponse) => {
          if (err.error.code === 400) {
            showError({
              title: 'System Error',
              text: err.error.data,
            });
          } else {
            showError({
              title: 'System Error',
              text: 'Something Went Wrong',
            });
          }
        },
      });
  }
}
