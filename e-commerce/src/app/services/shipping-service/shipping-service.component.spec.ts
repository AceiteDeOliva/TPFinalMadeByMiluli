import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingServiceComponent } from './shipping-service.component';

describe('ShippingServiceComponent', () => {
  let component: ShippingServiceComponent;
  let fixture: ComponentFixture<ShippingServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
