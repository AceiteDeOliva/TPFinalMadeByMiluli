import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEmplyeePageComponent } from './home-employee-page.component';

describe('HomeEmplyeePageComponent', () => {
  let component: HomeEmplyeePageComponent;
  let fixture: ComponentFixture<HomeEmplyeePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeEmplyeePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeEmplyeePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
