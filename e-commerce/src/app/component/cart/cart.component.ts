import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CartService } from '../../services/cart-service/cart.service';
import { ProductService } from '../../services/product-service/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
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
  @Output() subtotal = new EventEmitter<number>();
  @Output() lenght =new EventEmitter<number>();


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

  // Load cart items and fetch their details
  loadCart() {
    this.cartService.getCarrito().pipe(
      tap((cart: { productUrl: string; quantity: number }[]) => {
        this.cartItems = cart;
        console.log('Loading cart', this.cartItems);
        this.loadProductDetails();
      }),
      catchError((error) => {
        console.error('Error loading cart:', error);
        return of([]);
      })
    ).subscribe();

  }

  // Fetch product details for each item in the cart
  loadProductDetails() {
    const productRequests = this.cartItems.map(item =>
      this.productService.fetchProductWithImageByUrl(item.productUrl).pipe(
        map(productWithImage => ({ ...item, details: productWithImage.details }))
      )
    );
    this.calculateTotal();

    forkJoin(productRequests).subscribe({
      next: (updatedItems) => {
        this.cartItems = updatedItems;
        this.calculateTotal();  // Recalculate total when cart is updated
        this.emitCartUpdated();
      },
      error: (error) => {
        console.error('Error fetching product details:', error);
        this.cartItems = [];
        this.calculateTotal();
        this.emitCartUpdated();
      }
    });
  }


  emitCartUpdated() {
    const lenght= this.cartItems.length ;

  }

  // Calculate the total order amount (subtotal)
  calculateTotal() {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      const price = item.details?.price || 0;
      return total + (price * item.quantity);
    }, 0);

    // Emit the updated subtotal
    this.subtotal.emit(this.totalAmount);  // Emitting the subtotal value
  }

  // Format the total amount
  get formattedTotal() {
    return this.decimalPipe.transform(this.totalAmount, '1.0-0')?.replace(',', '.') || '0';
  }

  // Remove product from cart by ID
  removeFromCart(productId: string) {
    this.cartService.removeProductFromCart(productId).pipe(
      tap(() => {
        this.loadCart();  // Reload the cart after removing the product
        this.calculateTotal();
      }),
      catchError(error => {
        console.error('Error removing product from cart:', error);
        return of(null);
      })
    ).subscribe();
  }

  // Update the quantity of a product in the cart
  onQuantityChange(productId: string | undefined, quantity: number) {
    if (!productId) {
      console.warn('Product ID is undefined, cannot update quantity.');
      return;
    }

    if (quantity < 1) {
      alert('La cantidad debe ser al menos 1');
      return;
    }

    this.cartService.updateProductQuantity(productId, quantity).pipe(
      tap(() => {
        this.loadCart();  // Reload the cart after updating the quantity
        this.calculateTotal();
      }),
      catchError((error) => {
        console.error('Error updating product quantity:', error);
        return of(null);
      })
    ).subscribe();
  }

  // Navigate to the appropriate page (login or shipping info) based on user login status
  onStartPurchase() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!currentUser) {
      this.router.navigate(['loginPurchase']);  // Redirigir a la página de login si no está logueado
    } else {
      this.router.navigate(['shippingInfo']);  // Redirigir a la página de información de envío si está logueado
    }
  }
}
