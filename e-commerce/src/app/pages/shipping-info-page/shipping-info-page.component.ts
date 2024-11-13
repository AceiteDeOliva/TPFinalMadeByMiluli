import { Component } from '@angular/core';
import { ShippingComponent } from "../../component/shipping/shipping.component";

@Component({
  selector: 'app-shipping-info-page',
  standalone: true,
  imports: [ShippingComponent],
  templateUrl: './shipping-info-page.component.html',
  styleUrl: './shipping-info-page.component.css'
})
export class ShippingInfoPageComponent {

}
