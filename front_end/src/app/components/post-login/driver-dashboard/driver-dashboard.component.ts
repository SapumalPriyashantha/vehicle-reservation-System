import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-driver-dashboard',
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.scss']
})
export class DriverDashboardComponent {
  constructor(private storage:StorageService,private router: Router){

  }
  protected logout() {
    this.storage.clearAll();
    this.router.navigate(['/login']);
  }
}
