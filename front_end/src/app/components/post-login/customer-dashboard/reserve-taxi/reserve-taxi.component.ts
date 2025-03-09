import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, map, switchMap } from 'rxjs';
import { IDriver } from 'src/app/interface/IDriver';
import { IResponse } from 'src/app/interface/IResponse';
import { DriverService } from 'src/app/services/driver/driver.service';
import { MapService } from 'src/app/services/map/map.service';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { showError } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-reserve-taxi',
  templateUrl: './reserve-taxi.component.html',
  styleUrls: ['./reserve-taxi.component.scss'],
})
export class ReserveTaxiComponent implements OnInit {
  @ViewChild('map', { static: false }) mapElement: any;
  protected directionsService = new google.maps.DirectionsService();
  protected directionsRenderer = new google.maps.DirectionsRenderer();

  protected useCurrentLocation = false;

  protected drivers: IDriver[] = [];

  protected filteredPickupResults: any[] = [];
  protected filteredDropoffResults: any[] = [];

  protected markers: any[] = [];
  protected routePath: any[] = [];

  protected center = { lat: 6.927079, lng: 79.861244 };
  protected zoom = 13;

  protected form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private mapService: MapService,
    protected driverService: DriverService,
    protected service:ReservationService,
    private router: Router,
    protected route:ActivatedRoute
  ) {
    this.form = this.fb.group({
      pickUp: ['', Validators.required],
      dropOff: ['', Validators.required],
      pickupToggle: [false, Validators.required],
      dropoffToggle: [false, Validators.required],
    });
  }

  ngOnInit() {
    this.form
      .get('pickUp')
      ?.valueChanges.pipe(
        debounceTime(300),
        switchMap((value) => this.searchLocations(value))
      )
      .subscribe((results) => {
        console.log(results);

        this.filteredPickupResults = results;
      });

    this.form
      .get('dropOff')
      ?.valueChanges.pipe(
        debounceTime(300),
        switchMap((value) => this.searchLocations(value))
      )
      .subscribe((results) => {
        this.filteredDropoffResults = results;
      });
  }

  protected onCurrentLocationChange(): void {
    if (this.useCurrentLocation) {
      this.getCurrentLocation();
    } else {
      this.form.get('pickUp')?.setValue('');
    }
  }

  protected onToggleChange(type: string): void {
    if (type === 'pickup') {
      this.form.get('dropoffToggle')?.setValue(false);
    } else if (type === 'dropoff') {
      this.form.get('pickupToggle')?.setValue(false);
    }
  }

  protected setPickupLocation(name: string, lat: number, lng: number): void {
    this.form.get('pickUp')?.setValue(name);
    this.addMarker({ lat, lon: lng }, 'Pickup');
  }

  protected setDropoffLocation(name: string, lat: number, lng: number): void {
    this.form.get('dropOff')?.setValue(name);
    this.addMarker({ lat, lon: lng }, 'Dropoff');
  }

  protected getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.form.get('pickUp')?.setValue(`Lat: ${lat}, Lng: ${lon}`);
          this.addMarker({ lat, lon }, 'Pickup');
        },
        (error) => {
          console.error('Error getting current location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  protected onMapClick(event: google.maps.MapMouseEvent) {
    console.log(event);

    if (event.latLng) {
      const latLng = event.latLng;
      const lat = latLng.lat();
      const lng = latLng.lng();
      this.getAddress(lat, lng);
    }
  }

  protected getAddress(lat: number, lng: number): void {
    this.mapService
      .getAddress(lat, lng)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          if (this.form.get('pickupToggle')?.value) {
            this.setPickupLocation(res.display_name, lat, lng);
          }
          if (this.form.get('dropoffToggle')?.value) {
            this.setDropoffLocation(res.display_name, lat, lng);
          }
        },
        error: (err: HttpErrorResponse) => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });
  }

  protected searchDrivers() {
    if (this.markers.length >= 2) {
      this.routePath = [
        {
          lat: this.markers[0].position.lat,
          lng: this.markers[0].position.lng,
        },
        {
          lat: this.markers[1].position.lat,
          lng: this.markers[1].position.lng,
        },
      ];
    }

    this.driverService
      .findDrivers(this.markers[0].position.lng, this.markers[0].position.lat)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (!res.data.length) {
            showError({
              title: 'Oops',
              text: 'Currently,There is no any driver in your area.Please try again later',
            });
            return;
          }

          this.driverService.setDriverPayload(res.data);
          this.service.setMarkers(this.markers);
          this.router.navigate(['../available-drivers'],{relativeTo:this.route});
        },
        error: () => {
          showError({
            title: 'System Error',
            text: 'Something Went Wrong',
          });
        },
      });
  }

  protected toRoute(): void {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${this.markers[0].position.lat},${this.markers[0].position.lng}&destination=${this.markers[1].position.lat},${this.markers[1].position.lng}&travelmode=driving`;
    window.open(url, '_blank');
  }

  protected searchLocations(query: string) {
    if (query.length < 3) {
      return [];
    }

    return this.mapService.searchLocations(query).pipe(
      map((results) => results),
      untilDestroyed(this)
    );
  }

  protected onPickupSelect(result: any) {
    this.addMarker(
      this.filteredPickupResults.find(
        (x: any) => x.place_id === result.option.id
      ),
      'Pickup'
    );
  }

  protected onDropoffSelect(result: any) {
    this.addMarker(
      this.filteredDropoffResults.find(
        (x: any) => x.place_id === result.option.id
      ),
      'Dropoff'
    );
  }

  protected addMarker(result: any, type: string) {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    this.markers = this.markers.filter((marker) => marker.label !== type);
    // Add marker to the map
    this.markers = [
      ...this.markers,
      { position: { lat, lng: lon }, label: type },
    ];

    // Center the map on the selected location
    this.center = { lat, lng: lon };
    this.zoom = 13;
  }
}
