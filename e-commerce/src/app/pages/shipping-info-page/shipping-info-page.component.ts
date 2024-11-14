// shipping-info-page.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ShippingComponent } from '../../component/shipping/shipping.component';
import { SubtotalComponent } from '../../component/subtotal/subtotal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipping-info-page',
  standalone: true,
  imports: [ShippingComponent, SubtotalComponent, CommonModule],
  templateUrl: './shipping-info-page.component.html',
  styleUrls: ['./shipping-info-page.component.css']
})
export class ShippingInfoPageComponent {
  formValid: boolean = false;

  constructor(private router: Router) {}

  formValidation(isValid: boolean) {
    this.formValid = isValid;
  }

  onProceedToCheckout() {
    if (this.formValid) {
      this.router.navigate(['checkout']);
    }
  }
}
