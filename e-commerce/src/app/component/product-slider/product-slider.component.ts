import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

    this.productService.getTopStockProducts(8).pipe(
      switchMap((urls) => {
        const productDetails$ = urls.map(url =>
          this.productService.fetchProductWithImageByUrl(url).pipe(
            catchError(() => of({ details: null, productUrl: url }))
          )
        );
        return forkJoin(productDetails$);
      })
    ).subscribe((products) => {

      this.topStockProducts = products.filter(product => product.details !== null);


      this.topStockProducts.forEach((product) => {
        this.productColors[product.productUrl] = this.getRandomColorForProduct();
      });

      this.loading = false;
    });
  }
 @ViewChild('slider', { static: true }) slider!: ElementRef<HTMLDivElement>;

  // tu código actual (topStockProducts, loading, productColors...)

  scrollLeft() {
    this.slider.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.slider.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  navigateToProductPage(url: string) {
    if (url) {
      this.router.navigate([url]);
    }
  }


  getRandomColorForProduct(): string {
    const colors = ['#F8E1E4', '#FCD5CE', '#95CBEE', '#C4DCBB', '#FEE9B2'];
    let color: string;
    do {
      color = colors[Math.floor(Math.random() * colors.length)];
    } while (color === this.productColors[color]);
    return color;
  }
}
