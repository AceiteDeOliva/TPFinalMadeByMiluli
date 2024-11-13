import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { firstValueFrom } from 'rxjs';

declare var MercadoPago: any;

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {
  mp: any;  // MercadoPago instance
  preferenceId: string = '';  // Preferencia de pago que obtienes de tu backend

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Inicializa MercadoPago con tu public key
    this.mp = new MercadoPago('APP_USR-45356463-6ac7-49ed-a858-abeea75d9906', {
      locale: 'es-AR', // Elige tu localización
    });

    // Llamar al backend para obtener el preferenceId
    this.getPreferenceId();
  }

  // Llamada HTTP al servidor para obtener el preferenceId
  getPreferenceId() {
    firstValueFrom(this.http.post<{ id: string }>('/api/create_preference', {
      title: 'Mi producto',
      quantity: 1,
      unit_price: 2000
    })).then(
      (response) => {
        this.preferenceId = response.id;  // Save the preferenceId
        this.createPaymentBrick();  // Create the payment button once we have the preferenceId
        this.createWallet();  // Create the wallet brick after preferenceId is ready
      },
      (error) => {
        console.error('Error al obtener el preferenceId:', error);
      }
    );
  }

  // Método para crear el botón de pago con MercadoPago bricks
  createPaymentBrick() {
    const bricksBuilder = this.mp.bricks();

    // Crear el botón de pago en el contenedor HTML usando bricks
    bricksBuilder.create('button', {
      initialization: {
        preferenceId: this.preferenceId,  // El ID de la preferencia que obtuviste del backend
      },
      callbacks: {
        onReady: () => {
          console.log('El botón de pago está listo para ser mostrado');
        },
        onError: (error: any) => {
          console.error('Hubo un error al crear el botón de pago', error);
        },
      }
    }).mount('#mercadopago-button-container');
  }

  // Método para crear el wallet de pago de MercadoPago
  createWallet() {
    const bricksBuilder = this.mp.bricks();

    // Create the wallet brick with MercadoPago
    bricksBuilder.create('wallet', 'wallet_container', {
      initialization: {
        preferenceId: this.preferenceId,  // Use the preferenceId for the wallet
      },
      customization: {
        texts: {
          valueProp: 'smart_option',  // Customize text shown on the wallet brick
        },
      },
      callbacks: {
        onReady: () => {
          console.log('El wallet está listo para ser mostrado');
        },
        onError: (error: any) => {
          console.error('Hubo un error al crear el wallet', error);
        },
      }
    });
  }
}
