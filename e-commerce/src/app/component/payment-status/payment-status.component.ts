import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service/user.service';
import { ShippingService } from '../../services/shipping-service/shipping.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service/cart.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.css']
})
export class PaymentStatusComponent implements OnInit {
  paymentStatus: string | null = null;
  paymentId: string | null = null;
  orderSaved = false;
  userId: string | null = localStorage.getItem("currentUserId");
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private shippingService: ShippingService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParamMap;

    const allStatuses = queryParams.getAll('collection_status');
    console.log('All collection_status values:', allStatuses);

    this.paymentStatus = (allStatuses.find(s => s && s !== 'null')
      || queryParams.get('status')
      || 'unknown').toLowerCase();

    this.paymentId = queryParams.get('payment_id');

    console.log('Final paymentStatus:', this.paymentStatus);
    console.log('Payment ID:', this.paymentId);

    this.handlePaymentStatus();
  }




  private handlePaymentStatus(): void {
    if (this.paymentStatus === 'approved') {
      this.saveOrder('Procesando');
    } else if (this.paymentStatus === 'pending') {
      this.saveOrder('Pendiente');
    } else {
      this.saveOrder('Fallido');
    }
  }

  private saveOrder(state: 'Procesando' | 'Pendiente' | 'Fallido'): void {
    this.shippingService.getShippingData().subscribe({
      next: (order) => {
        if (order) {
          order.state = state;

          const userId = this.userId;
          if (userId) {
            this.userService.addOrderToPurchaseHistory(userId, order).subscribe({
              next: () => {
                console.log(`Order successfully added with state: ${state}`);
                this.orderSaved = true;

                if (state !== 'Fallido') {
                  this.reduceStock();
                  this.clearUserCart();
                  this.clearShippingData();
                }
              },
              error: (err) => {
                console.error('Failed to save order:', err);
                this.errorMessage = 'Failed to save the order. Please try again.';
              }
            });
          } else {
            console.error('User ID is missing. Cannot save order.');
            this.errorMessage = 'User ID is missing.';
          }
        } else {
          this.errorMessage = 'Order data is missing.';
        }
      },
      error: (err) => {
        console.error('Error fetching order data:', err);
        this.errorMessage = 'Could not retrieve order data.';
      }
    });
  }

  private clearUserCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        console.log('Cart successfully cleared.');
      },
      error: (err) => {
        console.error('Failed to clear cart:', err);
        this.errorMessage = 'Failed to clear the cart. Please try again.';
      }
    });
  }

  private clearShippingData(): void {
    this.shippingService.clearShippingData();
  }

  private reduceStock(): void {
    this.cartService.getCarrito().subscribe({
      next: (cartItems) => {
        const reduceStockObservables = cartItems.map(item =>
          this.cartService.reduceStock(item.productUrl.split('/').pop()!, item.quantity)
        );
        Promise.all(reduceStockObservables.map(obs => obs.toPromise()))
          .then(() => {
            console.log('Stock successfully reduced for all products.');
          })
          .catch(err => {
            console.error('Error reducing stock:', err);
            this.errorMessage = 'Failed to reduce stock for some products.';
          });
      },
      error: (err) => {
        console.error('Failed to fetch cart items for stock reduction:', err);
        this.errorMessage = 'Could not fetch cart items to reduce stock.';
      }
    });
  }

}
