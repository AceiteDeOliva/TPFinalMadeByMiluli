import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingInfoPageComponent } from './shipping-info-page.component';

describe('ShippingInfoPageComponent', () => {
  let component: ShippingInfoPageComponent;
  let fixture: ComponentFixture<ShippingInfoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingInfoPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
