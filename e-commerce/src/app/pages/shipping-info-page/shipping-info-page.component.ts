import { Component } from '@angular/core';
import { ShippingComponent } from '../../component/shipping/shipping.component';
import { SubtotalComponent } from '../../component/subtotal/subtotal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipping-info-page',
  standalone: true,
  imports: [ShippingComponent, SubtotalComponent,CommonModule],
  templateUrl: './shipping-info-page.component.html',
  styleUrls: ['./shipping-info-page.component.css']
})
export class ShippingInfoPageComponent {
  formValid : boolean = false;

  formValidation(isValid:boolean)
  {
    this.formValid =isValid;
  }

}
