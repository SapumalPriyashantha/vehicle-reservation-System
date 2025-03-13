import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserRoles } from 'src/app/enums/UserRoles.enum';
import { IDriver } from 'src/app/interface/IDriver';
import { IResponse } from 'src/app/interface/IResponse';
import { IUser } from 'src/app/interface/IUser';
import { IUserRegister } from 'src/app/interface/IUserRegister';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { DRIVER_INIT_IMAGE } from 'src/app/utility/constants/common-constant';
import { showError, showQuestion, showSuccess } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-driver-management',
  templateUrl: './driver-management.component.html',
  styleUrls: ['./driver-management.component.scss'],
})
export class DriverManagementComponent implements OnInit {
  protected displayedColumns: string[] = [
    'driverId',
    'username',
    'name',
    'nic',
    'licenseNumber',
    'address',
    'actions',
  ];

  protected form: FormGroup;
  protected driverId: number | null;

  protected drivers: IUser[] = [];
  protected selectedDriver: IDriver;

  protected searchTerm: string;

  protected editingDriver: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private service: CustomerService,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', [Validators.required]],
      nic: ['', [Validators.required]],
      telephone: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      profileImage: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadDriverData();
  }

  protected onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
  
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1]; 
        this.form.patchValue({
          profileImage: base64String
        });
      };
  
      reader.readAsDataURL(file);
    }
  }

  protected loadDriverData() {
    this.service
      .getAllActiveUsers()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.drivers = res.data.filter(
            (x: IUser) => x.role === UserRoles.DRIVER
          );
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });
  }

  protected submit() {
    if (!this.driverId && !this.editingDriver) {
      this.service
        .driverRegister(this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (res: IResponse) => {
            showSuccess({
              title: 'Success',
              text: 'New Driver Added Successfully',
            });
            this.clearForm();
            this.loadDriverData();
          },
          error: () => {
            showError({
              title: 'System Error',
              text: 'Something Went Wrong',
            });
          },
        });
    } else {
      this.service
        .driverUpdate(this.driverId!, this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (res: IResponse) => {
            showSuccess({
              title: 'Success',
              text: 'Driver Updated Successfully',
            });
            this.editingDriver = false;
            this.driverId = null;
            this.clearForm();
            this.loadDriverData();
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

  
  protected clearForm() {
    this.form.reset();
  }

  protected editDriver(driver: IUser) {
    this.editingDriver = true;
    this.driverId = driver.userId;

    this.form.patchValue({
      name: driver.name,
      address: driver.address,
      nic: driver.nic,
      email: driver.email,
      licenseNumber: driver.licenseNumber,
      telephone: driver.telephone,
    });
  }

  protected viewDriver(driver: IDriver, dialogRef: TemplateRef<any>) {
    
  }

  protected deleteDriver(driverId: number) {
    showQuestion(
      {
        title: 'Delete',
        text: 'Are you really want to delete this driver ?',
      },
      (isConfirmed) => {
        if (isConfirmed) {
          this.service
            .deleteDriver(driverId)
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res: IResponse) => {
                showSuccess({
                  title: 'Success',
                  text: 'Driver Deleted Successfully',
                });
                this.loadDriverData();
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
    );
  }

  protected search() {
    this.service
      .searchUser(this.searchTerm)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (!res.data.length) {
            showError({
              title: 'Sorry, No Result Found',
              text: 'Adjust your filters and try again',
            });
            return;
          }
          this.drivers = res.data.filter(
            (x: IUser) => x.role === UserRoles.DRIVER
          );
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
