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

    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
      this.selectedCategory = savedCategory;
      this.categoryService.changeCategory(savedCategory);
    }


    this.categoryService.currentCategory$.subscribe(category => {

      if (category !== this.selectedCategory) {
        this.selectedCategory = category;
        localStorage.setItem('selectedCategory', category);
      }
    });


    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {

        if (event.url === '/home') {
          this.categoryService.resetCategory();
          localStorage.removeItem('selectedCategory');
        }
      }
    });
  }

  get displayCategory(): string {
    this.title = this.selectedCategory + 's';
    return this.title;
  }


  onCategoryClick(category: string): void {
    this.selectedCategory = category;
    localStorage.setItem('selectedCategory', category);
    this.categoryService.changeCategory(category); 
  }
}
