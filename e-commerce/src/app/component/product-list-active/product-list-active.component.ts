import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { ProductService } from '../../services/product-service/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
@Component({
  selector: 'app-product-list-active',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list-active.component.html',
  styleUrl: './product-list-active.component.css'
})
export class ProductListActiveComponent implements OnInit, AfterViewInit {

  @Input() filterTerm: string = '';
  @Output() addToCart = new EventEmitter<string>();
favorites: string[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  colors: string[] = ['#FCD5CE', '#95CBEE', '#C4DCBB', '#FEE9B2'];
  productColors: { [id: string]: string } = {};
  lastColor: string | null = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef,
   private favoriteService: FavoritesService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.favoriteService.getFavorites().subscribe(favorites => {
      this.favorites = favorites;
      console.log('Favorites loaded:', this.favorites);
    });
    
  }

  loadProducts() {
    this.productService.getProducts().pipe(
      switchMap((data) => {
        this.products = data;
        this.applyFilter();

        const filteredProducts = this.products;
        const imageRequests = filteredProducts.map(product => {
          const imageId = product.imageUrl.split('/').pop();
          if (imageId) {
            return this.productService.getImage(imageId).pipe(
              map(imageData => {
                if (imageData && imageData.data) {
                  product.imageUrl = imageData.data;
                }
                this.productColors[product.id] = this.getRandomColorForProduct();
                return product;
              }),
              catchError(error => {
                console.error('Error loading image data:', error);
                return of(product);
              })
            );
          }
          this.productColors[product.id] = this.getRandomColorForProduct();
          return of(product);
        });

        return forkJoin(imageRequests);
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

    this.cdr.detectChanges();
  }

  getRandomColorForProduct(): string {
    let color: string;
    do {
      color = this.colors[Math.floor(Math.random() * this.colors.length)];
    } while (color === this.lastColor);
    this.lastColor = color;
    return color;
  }

  toggleFavorite(productId: string) {
  this.favoriteService.toggleFavorite(productId).subscribe(updatedFavs => {
    this.favorites = updatedFavs;
  });
}
  isFavorite(productId: string): boolean {
    return this.favorites.includes(productId);
  }


}
