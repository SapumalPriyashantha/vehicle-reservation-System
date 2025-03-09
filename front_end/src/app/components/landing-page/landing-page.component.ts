import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

  drivers = [
    {
      name: 'John Doe',
      image: 'assets/images/empty-user.jpg',
      rating: 4.5
    },
    {
      name: 'Jane Smith',
      image: 'assets/images/empty-user.jpg',
      rating: 4.8
    },
    {
      name: 'Alex Johnson',
      image: 'assets/images/empty-user.jpg',
      rating: 4.3
    },
  ];
}
