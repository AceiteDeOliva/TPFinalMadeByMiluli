import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, map,tap } from 'rxjs/operators';
import { CartService } from '../../services/cart-service/cart.service';
import { ProductService } from '../../services/product-service/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Array<{ productUrl: string; quantity: number; details?: Product | null }> = [];

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCarrito().pipe(
      tap((cart: { productUrl: string; quantity: number }[]) => {
        this.cartItems = cart;
        this.loadProductDetails();
      }),
      catchError((error) => {
        console.error('Error loading cart:', error);
        return of([]); 
      })
    ).subscribe();
  }

  loadProductDetails() {
    const productRequests = this.cartItems.map(item =>
      this.productService.fetchProductWithImageByUrl(item.productUrl).pipe(
        map(productWithImage => ({ ...item, details: productWithImage.details }))
      )
    );

    forkJoin(productRequests).subscribe(updatedItems => {
      this.cartItems = updatedItems;
    });
  }

  removeFromCart(productId: string) {
    this.cartService.removeProductFromCart(productId).pipe(
      tap(() => {
        this.loadCart();
      }),
      catchError(error => {
        console.error('Error removing product from cart:', error);
        return of(null);
      })
    ).subscribe();
  }
  
  onQuantityChange(productId: string | undefined, quantity: number) {
    if (!productId) {
      console.warn('Product ID is undefined, cannot update quantity.');
      return;
    }
  
    if (quantity < 1) {
      alert('La cantidad debe ser al menos 1');
      return;
    }
  
    this.cartService.updateProductQuantity(productId, quantity).subscribe(
      () => this.loadCart(), // Reload the cart after updating the quantity
      (error) => console.error('Error updating product quantity:', error)
    );
  }
  
  
  
}
