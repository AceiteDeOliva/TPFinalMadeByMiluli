import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CartService } from '../../services/cart-service/cart.service';
import { ProductService } from '../../services/product-service/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';  // Import DecimalPipe
import { UserService } from '../../services/user-service/user.service';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [DecimalPipe]  // Provide DecimalPipe
})
export class CartComponent implements OnInit {
  cartItems: Array<{ productUrl: string; quantity: number; details?: Product | null }> = [];
  totalAmount: number = 0;

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private productService: ProductService,
    private decimalPipe: DecimalPipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCarrito().pipe(
      tap((cart: { productUrl: string; quantity: number }[]) => {
        this.cartItems = cart;
        console.log('loading'+this.cartItems);
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
      this.calculateTotal(); // Recalculate total when cart is updated
    });
  }




  calculateTotal() {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      const price = item.details?.price || 0; // Fallback to 0 if no price is found
      return total + (price * item.quantity);
    }, 0);
  }

  get formattedTotal() {
    return this.decimalPipe.transform(this.totalAmount, '1.0-0')?.replace(',', '.') || '0';
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

  onStartPurchase() {
    // Check if the user is logged in by calling the user service
    const currentUser = this.userService.getUser(); // Assuming this method returns the current logged-in user or null if not logged in

    if (!currentUser) {
      // If not logged in, redirect to login page
      this.router.navigate(['loginPurchase']);
    } else {
      // If logged in, redirect to shipping info page
      this.router.navigate(['shippingInfo']);
    }
  }
}
