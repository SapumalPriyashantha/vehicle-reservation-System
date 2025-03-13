import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CarStatus } from 'src/app/enums/CarStatus.enum';
import { ICar } from 'src/app/interface/ICar';
import { IResponse } from 'src/app/interface/IResponse';
import { CarService } from 'src/app/services/car/car.service';
import { showError, showQuestion, showSuccess } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-car-management',
  templateUrl: './car-management.component.html',
  styleUrls: ['./car-management.component.scss'],
})
export class CarManagementComponent implements OnInit {
  protected displayedColumns: string[] = [
    'carId',
    'carModel',
    'licensePlate',
    'mileage',
    'passengerCapacity',
    'status',
    'actions',
  ];

  protected form: FormGroup;
  protected carId: number | null;

  protected cars: ICar[] = [];
  protected selectedCar: ICar;

  protected searchTerm: string;

  protected editingCar: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private service: CarService
  ) {
    this.form = this.fb.group({
      carModel: ['', Validators.required],
      licensePlate: ['', [Validators.required]],
      mileage: ['', [Validators.required]],
      passengerCapacity: ['', Validators.required],
      carImageBase64: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCarData();
  }

  protected onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        this.form.patchValue({
          carImageBase64: base64String,
        });
      };

      reader.readAsDataURL(file);
    }
  }

  protected loadCarData() {
    this.service
      .getAllCars()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.cars = res.data.filter(
            (x: ICar) => x.status !== CarStatus.INACTIVE
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
    if (!this.carId && !this.editingCar) {
      this.service
        .carRegister(this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (res: IResponse) => {
            showSuccess({
              title: 'Success',
              text: 'New Car Added Successfully',
            });
            this.clearForm();
            this.loadCarData();
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
        .carUpdate(this.carId!, this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (res: IResponse) => {
            showSuccess({
              title: 'Success',
              text: 'Car Updated Successfully',
            });
            this.editingCar = false;
            this.carId = null;
            this.clearForm();
            this.loadCarData();
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

  protected editCar(car: ICar) {
    this.editingCar = true;
    this.carId = car.carId;

    this.form.patchValue({
      carModel: car.carModel,
      licensePlate: car.licensePlate,
      mileage: car.mileage,
      passengerCapacity: car.passengerCapacity,
    });
  }

  protected viewCar(car: ICar, dialogRef: TemplateRef<any>) {}

  protected deleteCar(driverId: number) {
    showQuestion(
      {
        title: 'Delete',
        text: 'Are you really want to delete this Car ?',
      },
      (isConfirmed) => {
        if (isConfirmed) {
          this.service
            .deleteCar(driverId)
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res: IResponse) => {
                showSuccess({
                  title: 'Success',
                  text: 'Car Deleted Successfully',
                });
                this.loadCarData();
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
      .searchCar(this.searchTerm)
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
          this.cars = res.data.filter(
            (x: ICar) => x.status !== CarStatus.INACTIVE
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
