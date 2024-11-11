import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterActiveProductsComponent } from './filter-active-products.component';

describe('FilterActiveProductsComponent', () => {
  let component: FilterActiveProductsComponent;
  let fixture: ComponentFixture<FilterActiveProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterActiveProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterActiveProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
