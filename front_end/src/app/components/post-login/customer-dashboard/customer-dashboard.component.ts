import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent {
  constructor(private storage:StorageService,private router: Router){

  }
  protected logout() {
    this.storage.clearAll();
    this.router.navigate(['/login']);
  }
}
