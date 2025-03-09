import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentTripComponent } from './current-trip.component';

describe('CurrentTripComponent', () => {
  let component: CurrentTripComponent;
  let fixture: ComponentFixture<CurrentTripComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrentTripComponent]
    });
    fixture = TestBed.createComponent(CurrentTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
