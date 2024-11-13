import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart-service/cart.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product-service/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css'] // Corrected typo
})
export class ProductPageComponent implements OnInit {
  selectedProduct: Product | null | undefined;
  quantity: number = 1;
  showShippingPrices: boolean = false;
  showAddedToCartMessage: boolean = false; // Add this variable

  constructor(
    private router: Router,
    private cartService: CartService,
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const productUrl = this.route.snapshot.paramMap.get('productId');
    if (productUrl) {
      this.productService.fetchProductWithImageByUrl(productUrl).subscribe({
        next: (result) => {
          this.selectedProduct = result.details;
          if (!this.selectedProduct) {
            console.error('Product not found');
          } else {
            console.log('Loaded Product:', this.selectedProduct);
          }
        },
        error: (error) => {
          console.error('Error fetching product:', error);
        }
      });
    }
  }

  addToCart(quantity: number = 1): void {
    const product = this.selectedProduct;
    if (product) {
      this.cartService.addProductToCart(product.id, quantity).subscribe({
        next: () => {
          console.log(`${product.name} added to cart successfully! (Quantity: ${quantity})`);
          this.showAddedToCartMessage = true;
          setTimeout(() => {
            this.showAddedToCartMessage = false;
          }, 2000); // Message disappears after 3 seconds
        },
        error: () => alert('Error adding to cart')
      });
    } else {
      console.error('No product selected to add to cart.');
    }
  }

  toggleShippingPrices() {
    this.showShippingPrices = !this.showShippingPrices;
  }
}
