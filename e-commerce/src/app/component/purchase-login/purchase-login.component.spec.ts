import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseLoginComponent } from './purchase-login.component';

describe('PurchaseLoginComponent', () => {
  let component: PurchaseLoginComponent;
  let fixture: ComponentFixture<PurchaseLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
