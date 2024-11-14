import { Component, EventEmitter, Output } from '@angular/core';
import { CategoryService } from '../../services/category-service/category-service.component';
import { Router } from '@angular/router'; // Correct the import
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
    // Check if there's a saved category in localStorage
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
      this.categoryService.changeCategory(savedCategory); // Load saved category into the service
    }
  }

  onCategoryClick(category: string): void {
    this.categoryService.changeCategory(category); // Update the CategoryService with the selected category
    localStorage.setItem('selectedCategory', category); // Save the selected category in localStorage
    this.categorySelected.emit(category);
    this.router.navigate(['listCategory']);// Emit the category to the parent component (if needed)
  }
}
