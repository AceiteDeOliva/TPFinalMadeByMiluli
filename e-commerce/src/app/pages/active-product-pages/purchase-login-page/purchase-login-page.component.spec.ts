import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseLoginPageComponent } from './purchase-login-page.component';

describe('PurchaseLoginPageComponent', () => {
  let component: PurchaseLoginPageComponent;
  let fixture: ComponentFixture<PurchaseLoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseLoginPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
