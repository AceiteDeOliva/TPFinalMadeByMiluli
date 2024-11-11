import { Component } from '@angular/core';

import { ProductListActiveComponent } from '../../component/product-list-active/product-list-active.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports:[ProductListActiveComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {

  selectedCategory: string = '';

  onCategorySelected(category: string): void {
    this.selectedCategory = category;
  }

}
