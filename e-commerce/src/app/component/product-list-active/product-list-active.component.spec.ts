import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListActiveComponent } from './product-list-active.component';

describe('ProductListActiveComponent', () => {
  let component: ProductListActiveComponent;
  let fixture: ComponentFixture<ProductListActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListActiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
