import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DriverStatus } from 'src/app/enums/DriverStatus.enum';
import { IChangePassword } from 'src/app/interface/IChangePassword';
import { IDriver } from 'src/app/interface/IDriver';
import { IResponse } from 'src/app/interface/IResponse';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { DriverService } from 'src/app/services/driver/driver.service';
import { StorageService } from 'src/app/services/storage.service';
import { showError, showSuccess } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  protected settingsForm: FormGroup;
  protected passwordForm: FormGroup;
  protected isEditing = false;
  protected isAvailable = true;

  protected driver: IDriver;

  protected imageURL: string = 'assets/images/empty-user.jpg';

  constructor(
    private fb: FormBuilder,
    private storage: StorageService,
    private service: CustomerService,
    private router: Router
  ) {
    this.settingsForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      licenseNumber: ['', Validators.required],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.driver = this.storage.get('driver-data') as unknown as IDriver;

    this.driver.status === DriverStatus.AVAILABLE
      ? (this.isAvailable = true)
      : (this.isAvailable = false);

    this.settingsForm.patchValue({
      name: this.driver.name,
      email: this.driver.email,
      phone: this.driver.mobileNumber,
      licenseNumber: this.driver.licenseNumber,
    });

    this.imageURL = this.driver.profileImage;
  }

  protected onEditClick() {
    this.isEditing = true;
  }

  protected onSaveClick() {
    if (this.settingsForm.valid) {
      this.service
        .driverUpdate(this.driver.id, {
          ...this.settingsForm.value,
          profileImage: this.imageURL,
        })
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (res: IResponse) => {
            showSuccess({
              title: 'Success',
              text: 'Your details updated successfully',
            });
            this.isEditing = false;
            this.driver = {
              ...this.driver,
              ...this.settingsForm.value,
              profileImage: this.imageURL,
            };
            this.storage.set('driver-data', this.driver);
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
      id: this.driver.id,
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

  protected onProfilePictureChange(event: any) {
    const file = event.target.files[0];

    if (file.size > 100000) {
      showError({
        title: 'Image Size Exceeded',
        text: 'Maximum size of the attachment shall be 100kb',
      });
      event.target.value = '';
      return;
    }

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        this.imageURL = base64String;
      };

      reader.onerror = (error) => {
        console.error('Error converting file to base64', error);
      };

      reader.readAsDataURL(file);
    }
  }

  protected onStatusChange(event: any) {
    this.isAvailable = event.checked;

    // this.service
    //   .changeStatus(
    //     this.driver.id,
    //     this.isAvailable ? DriverStatus.AVAILABLE : DriverStatus.BUSY
    //   )
    //   .pipe(untilDestroyed(this))
    //   .subscribe({
    //     next: (res: IResponse) => {
    //       showSuccess({
    //         title: 'Success',
    //         text: 'Your status changed successfully',
    //       });
    //       this.driver = {
    //         ...this.driver,
    //         status: this.isAvailable
    //           ? DriverStatus.AVAILABLE
    //           : DriverStatus.BUSY,
    //       };
    //       this.storage.set('driver-data', this.driver);
    //     },
    //     error: () => {
    //       showError({
    //         title: 'System Error',
    //         text: 'Something Went Wrong',
    //       });
    //     },
    //   });
  }

  onCancelClick() {
    this.isEditing = false;
    this.imageURL = this.driver.profileImage;
  }
}
