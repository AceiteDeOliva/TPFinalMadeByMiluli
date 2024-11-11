import { Component } from '@angular/core';
import { ProductListActiveComponent } from '../../component/product-list-active/product-list-active.component';
import { CategoryService } from '../../services/category-service/category-service.component';
import { Router, NavigationStart } from '@angular/router'; // For detecting route changes

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ProductListActiveComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {

  selectedCategory: string = '';
  title: string = '';

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    // Check localStorage for a saved category on component initialization
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
      this.selectedCategory = savedCategory;
      this.categoryService.changeCategory(savedCategory); // Ensure the service has the correct category
    }

    // Subscribe to currentCategory$ to get the latest selected category
    this.categoryService.currentCategory$.subscribe(category => {
      // Only update if the category has changed from the stored one
      if (category !== this.selectedCategory) {
        this.selectedCategory = category;
        localStorage.setItem('selectedCategory', category); // Save to localStorage
      }
    });

    // Optionally: Listen for route changes to reset the category when needed
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Reset the filter on specific routes or on navbar click
        if (event.url === '/home') {  // Modify as needed for your routes
          this.categoryService.resetCategory();  // Reset category filter
          localStorage.removeItem('selectedCategory'); // Clear localStorage
        }
      }
    });
  }

  get displayCategory(): string {
    this.title = this.selectedCategory + 's'; // Add "s" to the category for plural
    return this.title;
  }

  // This method will be triggered when a navbar item is clicked
  onCategoryClick(category: string): void {
    this.selectedCategory = category;
    localStorage.setItem('selectedCategory', category); // Save to localStorage
    this.categoryService.changeCategory(category); // Update the category in the service
  }
}
