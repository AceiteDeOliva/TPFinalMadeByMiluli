import { Component, OnInit } from '@angular/core';
import { MercadopagoService } from '../../../services/mercadopago-service/mercadopago.service';

declare var MercadoPago: any; // Declare MercadoPago SDK

@Component({
  selector: 'app-checkout',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css'],
})
export class CheckoutComponent implements OnInit {
  total: number = 100; // Example total, replace with actual total calculation

  constructor(private mpService: MercadopagoService) {}

  ngOnInit(): void {
    // Initialize MercadoPago with your public key
    const mp = new MercadoPago('APP_USR-45356463-6ac7-49ed-a858-abeea75d9906', { locale: 'es-AR' });

    // Create order data
    const orderData = {
      title: 'Compra en Made by Miluli',
      quantity: 1,
      price: this.total,
    };

    // Call the backend to create the preference and render the MercadoPago button
    this.mpService.createPreference(orderData).toPromise().then((response) => {
      const preferenceId = response.id;

      // Create the MercadoPago button automatically
      this.createCheckoutButton(mp, preferenceId);
    }).catch((error) => {
      console.error('Error creating preference:', error);
      alert('Error al crear preferencia');
    });
  }

  createCheckoutButton(mp: any, preferenceId: string) {
    const brickBuilder = mp.bricks();

    // Render the MercadoPago wallet button automatically
    brickBuilder
      .create('wallet', 'wallet_container', {
        initialization: {
          preferenceId: preferenceId,
        },
      })
      .then(() => {
        console.log('Checkout button rendered');
      })
      .catch((err: any) => {
        console.error('Error creating checkout button', err);
      });
  }
}
