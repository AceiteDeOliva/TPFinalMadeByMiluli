import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseHistoryPageComponent } from './purchase-history-page.component';

describe('PurchaseHistoryPageComponent', () => {
  let component: PurchaseHistoryPageComponent;
  let fixture: ComponentFixture<PurchaseHistoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseHistoryPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseHistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
