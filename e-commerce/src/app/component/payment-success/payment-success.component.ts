import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user-service/user.service';
import { ShippingService } from '../../services/shipping-service/shipping.service';
import { CommonModule } from '@angular/common';

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
  preferenceId: string | null = null;
  orderSaved = false;
  userId: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private shippingService: ShippingService
  ) {}

  ngOnInit(): void {
    // Get payment status, payment_id, and preference_id from URL
    this.paymentStatus = this.route.snapshot.queryParamMap.get('collection_status');
    this.paymentId = this.route.snapshot.queryParamMap.get('payment_id');
    this.preferenceId = this.route.snapshot.queryParamMap.get('preference_id');
    this.userId = localStorage.getItem('currentUserId');

    // If the payment is approved, proceed to save the order
    if (this.paymentStatus === 'approved' && this.paymentId && this.userId) {
      this.saveOrder();
    } else {
      this.errorMessage = 'Payment was not approved or information is missing.';
    }
  }

  private saveOrder(): void {
    // Retrieve the order from the ShippingService
    this.shippingService.getShippingData().subscribe({
      next: (order) => {
        if (order) {
          // Save the order to the user's purchase history
          this.userService.addOrderToPurchaseHistory(this.userId!, order).subscribe({
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
          this.errorMessage = 'Order data is missing.';
        }
      },
      error: (err) => {
        console.error('Error fetching shipping data:', err);
        this.errorMessage = 'Could not retrieve order data.';
      }
    });
  }
}
