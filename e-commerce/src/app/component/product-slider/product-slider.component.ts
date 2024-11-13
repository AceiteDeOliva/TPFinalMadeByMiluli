import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, of, forkJoin } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.css'],
})
export class ProductSliderComponent implements OnInit {
  topStockProducts: { details: Product | null, productUrl: string }[] = [];
  loading = true;
  colors: string[] = ['#F8E1E4', '#FCD5CE', '#95CBEE', '#C4DCBB', '#FEE9B2'];
  productColors: { [productUrl: string]: string } = {};

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    // Fetch the top 4 product URLs with the most stock
    this.productService.getTopStockProducts(4).pipe(
      switchMap((urls) => {
        const productDetails$ = urls.map(url =>
          this.productService.fetchProductWithImageByUrl(url).pipe(
            catchError(() => of({ details: null, productUrl: url }))
          )
        );
        return forkJoin(productDetails$);
      })
    ).subscribe((products) => {
      // Filter out products with null details
      this.topStockProducts = products.filter(product => product.details !== null);

      // Assign a random color to each product
      this.topStockProducts.forEach((product) => {
        this.productColors[product.productUrl] = this.getRandomColorForProduct();
      });

      this.loading = false;
    });
  }

  // Navigate to the product page when a product is clicked
  navigateToProductPage(url: string) {
    if (url) {  // Ensure url is not null or undefined
      this.router.navigate([url]);
    }
  }

  // Get a random color, avoiding the last used color
  getRandomColorForProduct(): string {
    const colors = ['#F8E1E4', '#FCD5CE', '#95CBEE', '#C4DCBB', '#FEE9B2'];
    let color: string;
    do {
      color = colors[Math.floor(Math.random() * colors.length)];
    } while (color === this.productColors[color]); // Ensure the color is not the same as the last one
    return color;
  }
}
