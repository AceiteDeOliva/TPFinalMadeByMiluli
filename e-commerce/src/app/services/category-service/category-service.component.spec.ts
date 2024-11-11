import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryService } from './category-service.component';

describe('CategoryServiceComponent', () => {
  let component: CategoryService;
  let fixture: ComponentFixture<CategoryService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
