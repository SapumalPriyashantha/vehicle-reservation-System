import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, map, take } from 'rxjs';
import { DriverStatus } from 'src/app/enums/DriverStatus.enum';
import { UserRoles } from 'src/app/enums/UserRoles.enum';
import { IBookingHistory } from 'src/app/interface/IBookingHistory';
import { IDriver } from 'src/app/interface/IDriver';
import { IDriverRegister } from 'src/app/interface/IDriverRegister';
import { IResponse } from 'src/app/interface/IResponse';
import { IUser } from 'src/app/interface/IUser';
import { IUserRegister } from 'src/app/interface/IUserRegister';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { DriverService } from 'src/app/services/driver/driver.service';
import { MapService } from 'src/app/services/map/map.service';
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
  protected driverId: number;

  protected drivers: IUser[] = [];
  protected selectedDriver: IDriver;

  protected searchTerm: string;

  protected editingDriver: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private service: CustomerService,
    private mapService: MapService
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
     
      const driverRequest: IUserRegister = {
        ...this.form.value,
        profileImage: DRIVER_INIT_IMAGE,
      };
      this.service
        .driverRegister(driverRequest)
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
        .driverUpdate(this.driverId, this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (res: IResponse) => {
            showSuccess({
              title: 'Success',
              text: 'Driver Updated Successfully',
            });
            this.editingDriver = false;
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
    // this.selectedDriver = driver;
    // this.service
    //   .getLast5ReservationById(driver.id)
    //   .pipe(untilDestroyed(this))
    //   .subscribe({
    //     next: (res: IResponse) => {
    //       console.log(res);
    //       if (!res.data.length) {
    //         showError({
    //           title: 'Oops',
    //           text: 'Currently,There is no any completed reservation for this driver',
    //         });
    //         return;
    //       }
    //       //need to implement
    //       this.tripList = res.data;
    //       this.dialog.open(dialogRef);
    //     },
    //     error: () => {
    //       showError({
    //         title: 'System Error',
    //         text: 'Something Went Wrong',
    //       });
    //     },
    //   });
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
