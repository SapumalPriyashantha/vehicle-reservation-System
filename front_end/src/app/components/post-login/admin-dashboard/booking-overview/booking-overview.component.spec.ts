import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingOverviewComponent } from './booking-overview.component';

describe('BookingOverviewComponent', () => {
  let component: BookingOverviewComponent;
  let fixture: ComponentFixture<BookingOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingOverviewComponent]
    });
    fixture = TestBed.createComponent(BookingOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
