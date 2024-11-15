import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginForOrderPagesComponent } from './login-for-order-pages.component';

describe('LoginForOrderPagesComponent', () => {
  let component: LoginForOrderPagesComponent;
  let fixture: ComponentFixture<LoginForOrderPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginForOrderPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginForOrderPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
