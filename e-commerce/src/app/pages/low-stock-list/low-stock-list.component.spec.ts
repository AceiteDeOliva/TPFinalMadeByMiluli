import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowStockListComponent } from './low-stock-list.component';

describe('LowStockListComponent', () => {
  let component: LowStockListComponent;
  let fixture: ComponentFixture<LowStockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LowStockListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LowStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
