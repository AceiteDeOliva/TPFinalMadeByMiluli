import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart-service/cart.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product-service/product.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  selectedProduct: Product | null | undefined;
  quantity: number = 1;
  showShippingPrices: boolean = false;
  showAddedToCartMessage: boolean = false;
  cartMessage:string='';


  constructor(
    private location: Location,
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
        next: (response) => {
          console.log(`${product.name} added to cart successfully! (Quantity: ${quantity})`);
          this.showAddedToCartMessage = true;
          this.cartMessage = response.message;
          setTimeout(() => {
            this.showAddedToCartMessage = false; 
          }, 2000);
        },
        error: () => {
          this.cartMessage = 'Error adding to cart';
          alert(this.cartMessage);
        }
      });
    } else {
      console.error('No product selected to add to cart.');
    }
  }

  toggleShippingPrices() {
    this.showShippingPrices = !this.showShippingPrices;
  }
  goBack(): void {
    this.location.back();
  }
}
