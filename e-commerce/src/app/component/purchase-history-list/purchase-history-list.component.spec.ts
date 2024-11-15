import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseHistoryListComponent } from './purchase-history-list.component';

describe('PurchaseHistoryListComponent', () => {
  let component: PurchaseHistoryListComponent;
  let fixture: ComponentFixture<PurchaseHistoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseHistoryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
