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

  isCalculatingShipping: boolean = false;
  shippingCalculationError: string | null = null;


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
    this.shippingCalculationError = null; // Limpiar errores anteriores

    if (shippingMethod === 'domicilio') {
      const cpDestino = this.shippingForm.get('cpDestino')?.value;
      const provinciaDestino = this.shippingForm.get('provinciaDestino')?.value;

      // Validar que los campos necesarios estén llenos antes de llamar a la API
      if (cpDestino && provinciaDestino) {
        this.isCalculatingShipping = true; // Mostrar spinner de cálculo de envío
        this.shippingCost = 0; // Resetear costo de envío mientras se calcula

        this.shippingService.calculateCorreoArgentinoPrice({
          cpDestino: cpDestino,
          provinciaDestino: provinciaDestino
        }).subscribe({
          next: (response) => {
            if (response && response.paqarClasico && response.paqarClasico.aDomicilio !== undefined) {
              this.shippingCost = response.paqarClasico.aDomicilio;
              console.log("Costo de envío (Correo Argentino): " + this.shippingCost);
            } else {
              this.shippingCost = 0;
              this.shippingCalculationError = 'No se pudo obtener el costo de envío a domicilio. Verifique los datos.';
              console.error('Respuesta inesperada de Correo Argentino:', response);
            }
            this.isCalculatingShipping = false; // Ocultar spinner
          },
          error: (error) => {
            this.shippingCost = 0;
            this.isCalculatingShipping = false; // Ocultar spinner
            this.shippingCalculationError = 'Error al calcular el envío. Intente de nuevo.';
            console.error('Error al llamar a la API de Correo Argentino:', error);
          }
        });
      } else {
        this.shippingCost = 0; // Si faltan datos, el costo es 0
        this.shippingCalculationError = 'Ingrese Código Postal y Provincia de Destino para calcular el envío a domicilio.';
      }
    } else if (shippingMethod === 'sucursal') {
      // Si la opción "a sucursal" es un valor fijo (6000), se mantiene así.
      // Si también quieres obtener este valor de la API, harías una lógica similar.
      this.shippingCost = 6000;
      console.log("Costo de envío (Retiro en Sucursal): " + this.shippingCost);
    } else {
      this.shippingCost = 0; // Si no hay método seleccionado o es inválido
    }
  }


}
