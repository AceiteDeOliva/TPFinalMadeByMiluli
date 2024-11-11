import { Component } from '@angular/core';
import { FilterActiveProductsComponent } from '../../component/filter-active-products/filter-active-products.component';
import { ProductListActiveComponent } from '../../component/product-list-active/product-list-active.component';


@Component({
  selector: 'app-active-product-pages',
  standalone: true,
  imports: [ProductListActiveComponent, FilterActiveProductsComponent],
  templateUrl: './active-product-pages.component.html',
  styleUrls: ['./active-product-pages.component.css']
})
export class ActiveProductPagesComponent {
  searchTerm: string = '';

  onSearchTermChange(term: string): void {
    this.searchTerm = term;
  }
}
