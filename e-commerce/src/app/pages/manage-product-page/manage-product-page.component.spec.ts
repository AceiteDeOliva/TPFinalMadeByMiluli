import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProductPageComponent } from './manage-product-page.component';

describe('ManageProductPageComponent', () => {
  let component: ManageProductPageComponent;
  let fixture: ComponentFixture<ManageProductPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageProductPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
