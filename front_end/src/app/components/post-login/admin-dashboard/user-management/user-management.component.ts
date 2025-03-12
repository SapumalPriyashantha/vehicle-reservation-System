import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserRoles } from 'src/app/enums/UserRoles.enum';
import { IResponse } from 'src/app/interface/IResponse';
import { IUser } from 'src/app/interface/IUser';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { showError, showQuestion, showSuccess } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  protected searchTerm: string;
  protected displayedColumns: string[] = [
    'userId',
    'username',
    'name',
    'telephone',
    'address',
    'nic',
    'actions',
  ];

  protected users: IUser[] = [];
  protected selectUser: IUser;

  constructor(
    private service: CustomerService,
  ) {}

  ngOnInit(): void {
    this.loadCustomerData();
  }

  protected loadCustomerData() {
    this.service
      .getAllActiveUsers()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.users = res.data.filter(
            (x: IUser) => x.role === UserRoles.CUSTOMER
          );
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

  protected deleteUser(userId: number) {
    showQuestion(
      {
        title: 'Delete',
        text: 'Are you really want to delete this user ?',
      },
      (isConfirmed) => {
        if (isConfirmed) {
          this.service
            .deleteUser(userId)
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res: IResponse) => {
                showSuccess({
                  title: 'Success',
                  text: 'User Deleted Successfully',
                });
                this.loadCustomerData();
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
          this.users = res.data.filter(
            (x: IUser) => x.role === UserRoles.CUSTOMER
          );;
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
