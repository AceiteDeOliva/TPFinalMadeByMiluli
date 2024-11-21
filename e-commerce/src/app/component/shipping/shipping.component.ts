import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';
import { ShippingService } from '../../services/shipping-service/shipping.service';
import { CartService } from '../../services/cart-service/cart.service';
import { CartItem } from '../../models/cartItem';
import { CommonModule } from '@angular/common';
import { Order } from '../../models/orders';
import { ProductService } from '../../services/product-service/product.service';
import { map } from 'rxjs';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-shippingComponent',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ShippingComponent implements OnInit {
  shippingForm: FormGroup;
  isLoggedIn: boolean = false;
  userEmail: string = '';
  products: CartItem[] = [];
  shippingCost:number=0;
  cartSubtotal:number=0;
  @Output() formSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private shippingService: ShippingService,
    private cartService: CartService,
    private productService: ProductService,
    private authService :AuthService
  ) {
    this.shippingForm = this.fb.group({
      recipientName: ['', Validators.required],
      recipientSurname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      street: ['', Validators.required],
      provinciaDestino: ['', Validators.required],
      cpDestino: ['', Validators.required],
      shippingMethod: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchCartSubtotal();


    this.cartService.getCarrito().subscribe((cartItems) => {
      const productRequests = cartItems.map((cartItem) =>
        this.productService.fetchProductWithoutImageByUrl(cartItem.productUrl).pipe(
          map(({ details }) => ({
            ...cartItem,
            price: details?.price
          }))
        )
      );

      forkJoin(productRequests).subscribe((updatedCartItems) => {
        this.products = updatedCartItems;
      });
    });


    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId) {
      this.userService.getUserById(currentUserId).subscribe((currentUser) => {
        if (currentUser) {
          this.isLoggedIn = true;
          this.userEmail = currentUser.email;
          this.shippingForm.controls['email'].setValue(this.userEmail);
          this.shippingForm.controls['email'].disable();
        } else {
          this.isLoggedIn = false;
          this.shippingForm.controls['email'].enable();
        }
      }, (error) => {
        console.error('Error fetching user:', error);
        this.isLoggedIn = false;
        this.shippingForm.controls['email'].enable();
      });
    } else {
      this.isLoggedIn = false;
      this.shippingForm.controls['email'].enable();
    }


    this.shippingForm.get('shippingMethod')?.valueChanges.subscribe((method) => {
      this.updateShippingCost(method);
    });

  }

  saveShippingData(): void {
    if (this.shippingForm.valid) {

      const orderId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const orderData: Order = {
        orderId: orderId,
        products: this.products,
        date: new Date(),
        recipientName: this.shippingForm.value.recipientName,
        recipientSurname: this.shippingForm.value.recipientSurname,
        street: this.shippingForm.value.street,
        provinciaDestino: this.shippingForm.value.provinciaDestino,
        cpDestino: this.shippingForm.value.cpDestino,
        shippingMethod: this.shippingForm.value.shippingMethod,
        shippingCost: this.shippingCost,
        totalCost: this.cartSubtotal + this.shippingCost,
        state: 'Pendiente',
      };

      this.shippingService.setShippingData(orderData);
      console.log('Shipping data saved:', orderData);

      this.formSubmitted.emit(true);
    } else {
      console.log('Form is invalid');
      this.formSubmitted.emit(false);
    }

    this.authService.enableCheckout();

  }

  private fetchCartSubtotal(): void {
    this.cartService.getTotalCompra().subscribe({
      next: (subtotal) => {
        this.cartSubtotal = subtotal;


        const shippingMethod = this.shippingForm.get('shippingMethod')?.value;


        if (shippingMethod) {
          this.updateShippingCost(shippingMethod);
        } else {
          console.warn('Shipping method is not selected yet.');
        }
      },
      error: () => {
        console.error('Error fetching cart subtotal');
      }
    });
  }

  private updateShippingCost(shippingMethod: string): void {

    this.shippingCost = shippingMethod === 'domicilio' ? 8000 : 6000;
    console.log("Precio de envio: " + this.shippingCost);
  }
}
