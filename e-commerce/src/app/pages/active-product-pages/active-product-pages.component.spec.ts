import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveProductPagesComponent } from './active-product-pages.component';

describe('ActiveProductPagesComponent', () => {
  let component: ActiveProductPagesComponent;
  let fixture: ComponentFixture<ActiveProductPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveProductPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveProductPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
