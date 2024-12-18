import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProductPageComponent } from './update-product-page.component';

describe('UpdateProductPageComponent', () => {
  let component: UpdateProductPageComponent;
  let fixture: ComponentFixture<UpdateProductPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProductPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
