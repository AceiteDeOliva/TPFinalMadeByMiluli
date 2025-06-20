import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { ProductService } from '../../services/product-service/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites-service/favorites.service';
import { SimpleChanges } from '@angular/core';
@Component({
  selector: 'app-product-list-active',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list-active.component.html',
  styleUrl: './product-list-active.component.css'
})
export class ProductListActiveComponent implements OnInit, AfterViewInit {
  @Input() showOnlyFavorites: boolean = false;
  @Input() filterTerm: string = '';
  @Output() addToCart = new EventEmitter<string>();
  @Output() hasfavorites = new EventEmitter<boolean>();
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
  ) { }

  ngOnInit(): void {

    this.favoriteService.getFavorites().subscribe(favorites => {
      this.favorites = favorites;
      console.log('Favorites loaded:', this.favorites);
      if (this.favorites.length > 0) {
        this.hasfavorites.emit(true);
      }
    });
  this.loadProducts();
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

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['filterTerm'] || changes['showOnlyFavorites']) {
      this.applyFilter();

    }
  }

  applyFilter(): void {
    const lowerFilter = this.filterTerm.toLowerCase();
    let productsToFilter = this.products;

    if (this.showOnlyFavorites) {
      productsToFilter = productsToFilter.filter(product => this.favorites.includes(product.id));
    }

    this.filteredProducts = productsToFilter.filter(product =>
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
