import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service/user.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})

export class ProductListComponent implements OnInit {
  @Input() filterTerm: string = ''; // Input to receive the filter term
  products: Product[] = [];
  filteredProducts: Product[] = []; // Stores filtered products
  userCredential: string =  '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.getUserCredential();
  }

  getUserCredential(): void {
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId) {
      this.userService.getCredential(currentUserId).subscribe({
        next: (credential) => {
          this.userCredential = credential;
        },
        error: (error) => {
          console.error('Erros buscando credencial:', error);
        }
      });
    }
  }

  loadProducts() {
    this.productService.getProducts().pipe(
      switchMap((data) => {
        this.products = data;
        const imageRequests = this.products.map(product => {
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
  
        return forkJoin(imageRequests);
      })
    ).subscribe({
      next: (productsWithImages) => {
        this.products = productsWithImages;
        this.applyFilter(); // Apply filter after loading products
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }
  
  // Method to apply filter
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

  editProduct(selectedProduct: Product): void {
    console.log('Navigating to product ID:', selectedProduct.id);
    this.router.navigate(['updateProduct', selectedProduct.id]);
  }


  
}
