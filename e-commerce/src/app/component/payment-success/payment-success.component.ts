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
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
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
  ) {}

  ngOnInit(): void {
    this.paymentStatus = this.route.snapshot.queryParamMap.get('collection_status');
    this.paymentId = this.route.snapshot.queryParamMap.get('payment_id');

    console.log('Payment Status:', this.paymentStatus);
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
}
