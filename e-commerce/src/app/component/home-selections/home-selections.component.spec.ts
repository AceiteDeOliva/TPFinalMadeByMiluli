import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSelectionsComponent } from './home-selections.component';

describe('HomeSelectionsComponent', () => {
  let component: HomeSelectionsComponent;
  let fixture: ComponentFixture<HomeSelectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSelectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeSelectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
