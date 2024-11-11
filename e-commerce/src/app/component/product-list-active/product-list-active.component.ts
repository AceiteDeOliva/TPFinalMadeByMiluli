import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { ProductService } from '../../services/product-service/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list-active',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list-active.component.html',
  styleUrl: './product-list-active.component.css'
})
export class ProductListActiveComponent implements OnInit, AfterViewInit {

  @Input() filterTerm: string = ''; // Input to receive the filter term
  @Output() addToCart = new EventEmitter<string>();

  products: Product[] = [];
  filteredProducts: Product[] = [];
  colors: string[] = ['#F8E1E4', '#FCD5CE', '#95CBEE', '#C4DCBB', '#FEE9B2'];
  productColors: { [id: string]: string } = {}; // Store random color by product ID
  lastColor: string | null = null;  // Track the last color used

  constructor(
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef,
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
                this.productColors[product.id] = this.getRandomColorForProduct();  // Store the color for each product
                return product; // Return modified product
              }),
              catchError(error => {
                console.error('Error loading image data:', error);
                return of(product); // Return original product on error
              })
            );
          }
          this.productColors[product.id] = this.getRandomColorForProduct();  // Store the color for each product if no image
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
    this.router.navigate(['productView', selectedProduct.id]);
  }

  ngAfterViewInit(): void {
    // Trigger a manual change detection cycle
    this.cdr.detectChanges();
  }

  getRandomColorForProduct(): string {
    let color: string;
    do {
      color = this.colors[Math.floor(Math.random() * this.colors.length)];
    } while (color === this.lastColor); // Ensure the color is not the same as the last one
    this.lastColor = color; // Update the last color
    return color;
  }
}
