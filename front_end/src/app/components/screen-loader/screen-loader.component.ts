import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ScreenLoaderService } from 'src/app/services/screen-loader/screen-loader.service';

@Component({
  selector: 'app-screen-loader',
  templateUrl: './screen-loader.component.html',
  styleUrls: ['./screen-loader.component.scss'],
})
export class ScreenLoaderComponent implements OnInit {
  public loading: boolean;

  constructor(
    private loaderService: ScreenLoaderService,
    private cdr: ChangeDetectorRef
  ) {
    this.loading = true;
  }

  ngOnInit(): void {
    this.loaderService.isLoading.subscribe((v: boolean) => {
      this.loading = v;
      this.cdr.detectChanges();
    });
  }
}
