import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import jsPDF from 'jspdf';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import 'jspdf-autotable';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { IResponse } from 'src/app/interface/IResponse';
import { showError } from 'src/app/utility/helper';
import { DriverService } from 'src/app/services/driver/driver.service';
import { DriverStatus } from 'src/app/enums/DriverStatus.enum';
import { IUser } from 'src/app/interface/IUser';
import { IDriver } from 'src/app/interface/IDriver';
import { CarService } from 'src/app/services/car/car.service';
import { ICar } from 'src/app/interface/ICar';
import * as moment from 'moment';
import { ICompletePayment } from 'src/app/interface/ICompletePayment';

@UntilDestroy()
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit{
  protected paymentData: ICompletePayment[] = [];

  protected displayedColumns: string[] = [
    'date',
    'driverName',
    'paymentStatus',
    'paymentTime',
    'amount',
    'actions',
  ];

  protected form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private service: ReservationService,
    private customerService: CustomerService,
    private carService: CarService
  ) {
    this.form = this.fb.group({
      fromDate: [moment(), Validators.required],
      toDate: [moment(), Validators.required],
    });
  }
  ngOnInit(): void {
    this.submit();
  }

  submit() {
    const { fromDate, toDate } = this.form.value;

    const from = moment(fromDate).format('YYYY-MM-DD');
    const to = moment(toDate).format('YYYY-MM-DD');

    this.service
      .getPaymentDetails(from, to)
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
          this.paymentData = res.data;
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });
  }

  downloadCustomerReport() {
    this.customerService
      .getAllActiveUsers()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          const doc = new jsPDF();

          // Add Header
          const pageWidth = doc.internal.pageSize.getWidth();
          doc.setFontSize(18);
          doc.text('All User Details', pageWidth / 2, 10, { align: 'center' });

          // Prepare table columns and rows
          const columns = [
            'ID',
            'Name',
            'Address',
            'Mobile Number',
            'Username',
            'NIC',
            'Role',
          ];
          const rows = res.data.map((user: IUser) => [
            user.userId,
            user.name,
            user.address,
            user.telephone,
            user.username,
            user.nic,
            user.role,
          ]);

          // Generate the table
          (doc as any).autoTable({
            head: [columns],
            body: rows,
            startY: 30,
            margin: { top: 10, bottom: 20 },
          });

          // Add Footer
          const pageHeight = doc.internal.pageSize.getHeight();
          doc.setFontSize(10);
          doc.text('Generated by the System', pageWidth / 2, pageHeight - 10, {
            align: 'center',
          });

          // Save the PDF
          doc.save('user-details.pdf');
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });
  }

  downloadCarReport() {
    this.carService
      .getAllCars()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          const doc = new jsPDF();

          // Add Header
          const pageWidth = doc.internal.pageSize.getWidth();
          doc.setFontSize(18);
          doc.text('All Car Details', pageWidth / 2, 10, {
            align: 'center',
          });

          // Prepare table columns and rows
          const columns = [
            'ID',
            'Car Model',
            'License Plate',
            'Mileage',
            'passengerCapacity',
            'status',
          ];
          const rows = res.data.map((car: ICar) => [
            car.carId,
            car.carModel,
            car.licensePlate,
            car.mileage,
            car.passengerCapacity,
            car.status,
          ]);

          // Generate the table
          (doc as any).autoTable({
            head: [columns],
            body: rows,
            startY: 30,
            margin: { top: 10, bottom: 20 },
          });

          // Add Footer
          const pageHeight = doc.internal.pageSize.getHeight();
          doc.setFontSize(10);
          doc.text('Generated by the System', pageWidth / 2, pageHeight - 10, {
            align: 'center',
          });

          // Save the PDF
          doc.save('car-details.pdf');
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });
  }

  downloadPaymentReport(data: any) {
    console.log(data);
    const doc = new jsPDF();

    // Add Header
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(18);
    doc.text('Mega City Cab', pageWidth / 2, 10, { align: 'center' });

    doc.setFontSize(12);
    doc.text('Payment Receipt', pageWidth / 2, 16, { align: 'center' });

    // Define table content
    const template = [
      ['Date', data.date],
      ['Driver Name', data.driverName],
      ['Payment Status', data.paymentStatus],
      ['Payment Time', data.paymentTime],
      ['Amount', data.amount],
    ];

    // Add table with content
    (doc as any).autoTable({
      startY: 30, // Start position after the header
      head: [['Field', 'Value']],
      body: template,
      margin: { top: 10, bottom: 20 },
    });

    // Add Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.text(
      'This is a system generated receipt',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // Save the generated PDF
    doc.save('payment-details.pdf');
  }
}
