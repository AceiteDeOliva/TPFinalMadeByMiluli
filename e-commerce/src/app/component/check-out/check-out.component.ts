import { UserService } from '../../services/user-service/user.service';
import { Component, OnInit } from '@angular/core';
import { MercadopagoService } from '../../services/mercadopago-service/mercadopago.service';
import { CheckoutDataService } from '../../services/checkout-data/checkout-data.service';
import { lastValueFrom } from 'rxjs';
import { ShippingService } from '../../services/shipping-service/shipping.service';
import { Order } from '../../models/orders';
import { SubtotalComponent } from '../subtotal/subtotal.component';
import { CartComponent } from '../cart/cart.component';

declare var MercadoPago: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './check-out.component.html',
  standalone: true,
  styleUrls: ['./check-out.component.css'],
  imports: [SubtotalComponent, CartComponent],
})
export class CheckoutComponent implements OnInit {
  total: number = 0;
  

  constructor(
    private mpService: MercadopagoService,
    private checkoutDataService: CheckoutDataService,
    private shippingService: ShippingService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Retrieve total amount from CheckoutDataService
    this.checkoutDataService.getTotalAmount().subscribe((amount) => {
      this.total = amount;
    });

    // Initialize MercadoPago with public key
    const mp = new MercadoPago('APP_USR-45356463-6ac7-49ed-a858-abeea75d9906', { locale: 'es-AR' });
    const orderData = {
      title: 'Compra en Made by Miluli',
      quantity: 1,
      price: this.total,
    };

    // Use lastValueFrom to create preference and render button
    this.createPreferenceAndButton(mp, orderData);
  }

  async createPreferenceAndButton(mp: any, orderData: any) {
    try {
      const response = await lastValueFrom(this.mpService.createPreference(orderData));
      this.createCheckoutButton(mp, response.id);
    } catch (error) {
      console.error('Error creating preference:', error);
      alert('Error al crear preferencia');
    }
  }

  createCheckoutButton(mp: any, preferenceId: string) {
    const brickBuilder = mp.bricks();
    brickBuilder.create('wallet', 'wallet_container', {
      initialization: { preferenceId: preferenceId },
    }).catch((err: any) => {
      console.error('Error creating checkout button', err);
    });
  }


  onPaymentSuccess() {
    // Retrieve the saved order data from ShippingService
    this.shippingService.getShippingData().subscribe((order: Order | null) => {
      if (order) {
        // Get the user ID (Assuming you have it stored in localStorage or elsewhere)
        const userId = localStorage.getItem('currentUserId');
        
        if (userId) {
          // Save the order to the user's purchaseHistory in UserService
          this.userService.addOrderToPurchaseHistory(userId, order).subscribe(() => {
            console.log('Order saved to purchase history');
          });
        }
      }
    });
  }
}
