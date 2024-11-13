import { Component } from '@angular/core';
import { ShippingService } from '../../services/shipping-service/shipping-service.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shipping.component.html',
  styleUrl: './shipping.component.css'
})
export class ShippingComponent {
  cpOrigen ='7600';
  cpDestino = '';
  provinciaOrigen = 'AR-B';
  provinciaDestino = '';
  peso = '';
  shippingCost: any;

  constructor(private shippingService: ShippingService) {}

  calculateShippingCost() {
    this.shippingService.calculateShipping(this.cpOrigen, this.cpDestino, this.provinciaOrigen, this.provinciaDestino, this.peso)
      .subscribe(
        (response) => {
          this.shippingCost = response;
          console.log('Shipping Cost:', this.shippingCost);
        },
        (error) => {
          console.error('Error calculating shipping:', error);
        }
      );
  }
}
