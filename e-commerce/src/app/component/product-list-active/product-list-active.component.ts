import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service/user.service';


@Component({
  selector: 'app-product-list-active',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list-active.component.html',
  styleUrl: './product-list-active.component.css'
})
export class ProductListActiveComponent implements OnInit {

  @Input() filterTerm: string = '';

  products: Product[] = [];
  filteredProducts: Product[] = [];
  colors: string[] = ['#F8E1E4', '#FCD5CE', '#95CBEE', '#C4DCBB', '#FEE9B2'];



  constructor(
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProducts();

  }

  loadProducts() {
    this.productService.getProducts().pipe(
      switchMap((data) => {
        this.products = data;
        this.applyFilter(); // Apply filter immediately after loading products

        const filteredProducts = this.products; // Use the filtered products for image loading
        const imageRequests = filteredProducts.map(product => {
          const imageId = product.imageUrl.split('/').pop();
          if (imageId) {
            return this.productService.getImage(imageId).pipe(
              map(imageData => {
                if (imageData && imageData.data) {
                  product.imageUrl = imageData.data; // Update image URL
                }
                return product; // Return modified product
              }),
              catchError(error => {
                console.error('Error loading image data:', error);
                return of(product); // Return original product on error
              })
            );
          }
          return of(product); // Return original product if no ID
        });

        return forkJoin(imageRequests); // Load images only for filtered products
      })
    ).subscribe({
      next: (productsWithImages) => {
        this.products = productsWithImages;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }



  ngOnChanges(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    const lowerFilter = this.filterTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(lowerFilter) ||
      product.category.toLowerCase().includes(lowerFilter)
    );
  }

  selectProduct(selectedProduct: Product): void {
    console.log('Navigating to product ID:', selectedProduct.id);
    this.router.navigate(['productView', selectedProduct.id]);
  }
  getRandomColor(): string {
    return this.colors[Math.floor(Math.random() * this.colors.length)];}



}
