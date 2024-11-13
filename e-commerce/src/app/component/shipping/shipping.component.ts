import { Component, Input } from '@angular/core';
import { ShippingService } from '../../services/shipping-service/shipping-service.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './shipping.component.html',
  styleUrl: './shipping.component.css'
})
export class ShippingComponent {
  shippingForm: FormGroup;
  shippingCost: any;

  constructor(private shippingService: ShippingService, private fb: FormBuilder) {
    // Initialize form with default values
    this.shippingForm = this.fb.group({
      cpOrigen: '',
      cpDestino: '',
      provinciaOrigen: '',
      provinciaDestino: '',
      peso: ''
    });
  }

  calculateShippingCost() {
    const { cpOrigen, cpDestino, provinciaOrigen, provinciaDestino, peso } = this.shippingForm.value;

    // Pass each form field as an argument to calculateShipping
    this.shippingService.calculateShipping(cpOrigen, cpDestino, provinciaOrigen, provinciaDestino, peso)
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
