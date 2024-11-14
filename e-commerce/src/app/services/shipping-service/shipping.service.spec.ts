import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShippingService } from './shipping.service';


describe('ShippingServiceComponent', () => {
  let component: ShippingService;
  let fixture: ComponentFixture<ShippingService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
