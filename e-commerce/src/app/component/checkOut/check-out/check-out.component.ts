import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MercadopagoService } from '../../../services/mercadopago-service/mercadopago.service';
declare var MercadoPago: any;

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {
  mp: any;  // MercadoPago instance
  preferenceId: string = '';  // Payment preference ID from backend

  constructor(private mercadopagoService: MercadopagoService) {}

  ngOnInit(): void {
    // Initialize MercadoPago with your public key
    this.mp = new MercadoPago('APP_USR-45356463-6ac7-49ed-a858-abeea75d9906', {
      locale: 'es-AR', // Set your locale
    });

    // Call backend to get preferenceId
    this.getPreferenceId();
  }

  // Call backend through the service to get preferenceId
  getPreferenceId() {
    const preferenceData = {
      title: 'Mi producto',
      quantity: 1,
      unit_price: 2000
    };
  
    firstValueFrom(this.mercadopagoService.createPreference(preferenceData)).then(
      (response: { id: string }) => {  // Specify the expected response type
        this.preferenceId = response.id;
        this.createPaymentBrick();
        this.createWallet();
      },
      (error) => {
        console.error('Error fetching preferenceId:', error);
      }
    );
  }
  

  // Method to create the payment button with MercadoPago bricks
  createPaymentBrick() {
    const bricksBuilder = this.mp.bricks();

    bricksBuilder.create('button', {
      initialization: {
        preferenceId: this.preferenceId,  // Set the preferenceId
      },
      callbacks: {
        onReady: () => {
          console.log('Payment button is ready');
        },
        onError: (error: any) => {
          console.error('Error creating payment button', error);
        },
      }
    }).mount('#mercadopago-button-container');
  }

  // Method to create the payment wallet brick with MercadoPago
  createWallet() {
    const bricksBuilder = this.mp.bricks();
  
    // Ensure three arguments: type, container ID, and options
    bricksBuilder.create('wallet', '#wallet_container', {
      initialization: {
        preferenceId: this.preferenceId,  // Use the preferenceId for wallet
      },
      customization: {
        texts: {
          valueProp: 'smart_option',  // Customize wallet text
        },
      },
      callbacks: {
        onReady: () => {
          console.log('Wallet is ready');
        },
        onError: (error: any) => {
          console.error('Error creating wallet', error);
        },
      }
    });
  }
  
}
