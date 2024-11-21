import { Component, EventEmitter, Output } from '@angular/core';
import { CategoryService } from '../../services/category-service/category-service.component';
import { Router } from '@angular/router'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-selections',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home-selections.component.html',
  styleUrl: './home-selections.component.css'
})
export class HomeSelectionsComponent {
  @Output() categorySelected = new EventEmitter<string>();

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {

    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
      this.categoryService.changeCategory(savedCategory);
    }
  }

  onCategoryClick(category: string): void {
    this.categoryService.changeCategory(category);
    localStorage.setItem('selectedCategory', category);
    this.categorySelected.emit(category);
    this.router.navigate(['listCategory']);
  }
}
