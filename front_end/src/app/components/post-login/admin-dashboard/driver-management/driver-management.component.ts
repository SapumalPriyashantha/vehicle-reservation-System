import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, map, take } from 'rxjs';
import { DriverStatus } from 'src/app/enums/DriverStatus.enum';
import { IBookingHistory } from 'src/app/interface/IBookingHistory';
import { IDriver } from 'src/app/interface/IDriver';
import { IDriverRegister } from 'src/app/interface/IDriverRegister';
import { IResponse } from 'src/app/interface/IResponse';
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
    'licenseNumber',
    'username',
    'mobile',
    'email',
    'lastLoginDate',
    'lastLogoutDate',
    'status',
    'actions',
  ];


  protected form: FormGroup;
  protected driverId: number;

  protected drivers: IDriver[] = [];
  protected selectedDriver: IDriver;

  protected searchTerm: string;
  protected tripList: any[] = [];

  protected editingDriver: boolean = false;
  protected pickUpLocations: { [tripId: string]: Observable<string> } = {};
  protected dropOffLocations: { [tripId: string]: Observable<string> } = {};

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private service: DriverService,
    private mapService: MapService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      licenseNumber: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadDriverData();
    
  }
  protected loadDriverData() {
    this.service
    .getAllDrivers(DriverStatus.ALL)
    .pipe(untilDestroyed(this))
    .subscribe({
      next: (res: IResponse) => {
        this.drivers = res.data;
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
      const username = this.generateRandomUsername(
        this.form.get('name')?.value
      );
      const password = this.generateRandomPassword();

      const driverRequest: IDriverRegister = {
        ...this.form.value,
        userName: username,
        password: password,
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
            this.editingDriver=false;
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
        .driverUpdate(this.driverId,this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (res: IResponse) => {
            showSuccess({
              title: 'Success',
              text: 'Driver Updated Successfully',
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
    }
  }

  protected generateRandomUsername(name: string): string {
    const nameWithoutSpaces = name.replace(/\s+/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${nameWithoutSpaces}${randomNum}`;
  }

  protected generateRandomPassword(length: number = 10): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
      password += randomChar;
    }
    return password;
  }

  protected clearForm() {
    this.form.reset();
  }

  protected editDriver(driver: IDriver) {
    this.editingDriver = true;
    this.driverId = driver.id;

    this.form.patchValue({
      name:driver.name,
      email:driver.email,
      licenseNumber:driver.licenseNumber,
      mobileNumber:driver.mobileNumber
    })
  }

  protected viewDriver(driver: IDriver, dialogRef: TemplateRef<any>) {
    this.selectedDriver = driver;
    this.service.getLast5ReservationById(driver.id).pipe(untilDestroyed(this)).subscribe({
      next: (res: IResponse) => {
        console.log(res);
        if (!res.data.length) {
          showError({
            title: 'Oops',
            text: 'Currently,There is no any completed reservation for this driver',
          });
          return;
        }
        //need to implement
        this.tripList = res.data;
        this.dialog.open(dialogRef);
      },
      error: () => {
        showError({
          title: 'System Error',
          text: 'Something Went Wrong',
        });
      },
    })
    
    
  }

  protected deleteDriver(driverId:number) {
    showQuestion(
      {
        title: 'Delete',
        text: 'Are you really want to delete this driver ?',
      },
      (isConfirmed) => {
        if(isConfirmed){
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
      .searchDriver(this.searchTerm)
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
          this.drivers = res.data;
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });
  }

  protected getPickUpLocation(trip: IBookingHistory): Observable<string> {
    if (!this.pickUpLocations[trip.id]) {
      this.pickUpLocations[trip.id] = this.mapService
        .getAddress(trip.pickupLatitude, trip.pickupLongitude)
        .pipe(
          take(1), 
          map((res) => res.display_name),
          untilDestroyed(this) 
        );
    }

    return this.pickUpLocations[trip.id];
  }

  protected getDropOffLocation(trip: IBookingHistory): Observable<string> {
    if (!this.dropOffLocations[trip.id]) {
      this.dropOffLocations[trip.id] = this.mapService
        .getAddress(trip.dropLatitude, trip.dropLongitude)
        .pipe(
          take(1), 
          map((res) => res.display_name),
          untilDestroyed(this) 
        );
    }

    return this.dropOffLocations[trip.id];
  }
}
