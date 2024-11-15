import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user-service/user.service';
import { ShippingService } from '../../services/shipping-service/shipping.service';
import { CommonModule } from '@angular/common';
import { MercadopagoService } from '../../services/mercadopago-service/mercadopago.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
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
    private mercadopagoService: MercadopagoService,
    private shippingService: ShippingService
  ) {}

  ngOnInit(): void {
    this.paymentId = this.route.snapshot.queryParamMap.get('payment_id');
  
    if (this.paymentId) {
      this.checkPaymentStatus(this.paymentId); // Check payment status from the server
    } else {
      this.errorMessage = 'Missing payment ID.';
    }
  }
  
  checkPaymentStatus(paymentId: string): void {
    this.mercadopagoService.getPaymentStatus(paymentId).subscribe({
      next: (response: { status: string }) => {
        if (response.status === 'approved') {
          console.log('Payment successful!');
  
          // Call saveOrder to save the order if payment is successful
          this.saveOrder();
        } else if (response.status === 'unknown') {
          this.errorMessage = 'Payment not found. Please try again.';
        } else {
          this.errorMessage = `Payment ${response.status}.`;
        }
      },
      error: (err) => {
        console.error('Error checking payment status:', err);
        this.errorMessage = 'Could not verify payment status.';
      }
    });
  }

  private saveOrder(): void {
    // Retrieve the order details from ShippingService
    this.shippingService.getShippingData().subscribe({
      next: (order) => {
        if (order) {
          const userId = this.userId; // Retrieve userId from local storage or component property
          if (userId) {
            // Save the order to the user's purchase history
            this.userService.addOrderToPurchaseHistory(userId, order).subscribe({
              next: () => {
                console.log('Order successfully added to purchase history');
                this.orderSaved = true; 
              },
              error: (err) => {
                console.error('Failed to save order:', err);
                this.errorMessage = 'Failed to save the order. Please try again.';
              },
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
  
  
  
}
