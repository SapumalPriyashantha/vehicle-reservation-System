import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableDriversComponent } from './available-drivers.component';

describe('AvailableDriversComponent', () => {
  let component: AvailableDriversComponent;
  let fixture: ComponentFixture<AvailableDriversComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvailableDriversComponent]
    });
    fixture = TestBed.createComponent(AvailableDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
