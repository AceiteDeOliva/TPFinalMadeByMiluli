import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CartService } from '../../services/cart-service/cart.service';
import { ProductService } from '../../services/product-service/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MercadopagoService } from '../../services/mercadopago-service/mercadopago.service';
import { PreferenceData } from '../../models/preference';
import { DecimalPipe } from '@angular/common';
import { UserService } from '../../services/user-service/user.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [DecimalPipe]
})
export class CartComponent implements OnInit {
  cartItems: Array<{ productUrl: string; quantity: number; details?: Product | null }> = [];
  totalAmount: number = 0;
  @Output() subtotal = new EventEmitter<number>();
  @Output() lenght =new EventEmitter<number>();
  @Input() inputIsTrue: boolean = true;


  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private decimalPipe: DecimalPipe,
    private router: Router,
    private authService :AuthService
  ) {}


  ngOnInit(): void {
    this.loadCart();
    this.authService.enableShipping();
  }

//Obtener productos del carrito del usuario actual guardados
  loadCart() {
    this.cartService.getCarrito().pipe(
      tap((cart: { productUrl: string; quantity: number }[]) => {
        this.cartItems = cart;
        console.log('Loading cart', this.cartItems);
        console.log('Loading cart', localStorage.getItem('currentUserId'));
        this.loadProductDetails();
      }),
      catchError((error) => {
        console.error('Error loading cart:', error);
        return of([]);
      })
    ).subscribe();
  }

//cargar losdatos delproducto con la imagen
  loadProductDetails() {
    const productRequests = this.cartItems.map(item =>
      this.productService.fetchProductWithImageByUrl(item.productUrl).pipe(
        map(productWithImage => {
          if (productWithImage.details?.state === 'active') {

            const availableQuantity = Math.min(item.quantity, productWithImage.details.stock);


            return {
              ...item,
              quantity: availableQuantity,
              details: productWithImage.details
            };
          } else {

            return null;
          }
        })
      )
    );

    forkJoin(productRequests).subscribe({
      next: (updatedItems) => {

        this.cartItems = updatedItems.filter(item => item !== null) as { productUrl: string; quantity: number; details: any }[];
        this.calculateTotal();
        this.emitCartUpdated();
      },
      error: (error) => {
        console.error('Error fetching product details:', error);
        this.cartItems = [];
        this.calculateTotal();
        this.emitCartUpdated();
      }
    });
  }



//Aviso de cambio en elcarrito
  emitCartUpdated() {
    const lenght= this.cartItems.length ;

  }

//calculo precio total de elementos en el carrito
  calculateTotal() {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      const price = item.details?.price || 0;
      return total + (price * item.quantity);
    }, 0);


    this.subtotal.emit(this.totalAmount);
  }


  get formattedTotal() {
    return this.decimalPipe.transform(this.totalAmount, '1.0-0')?.replace(',', '.') || '0';
  }

// Borrar elemento del carrito
  removeFromCart(productId: string) {
  this.cartService.removeProductFromCart(productId).pipe(
    tap(() => {
      this.cartItems = this.cartItems.filter(item => item.details?.id !== productId);
      this.calculateTotal();
    }),
    catchError(error => {
      console.error('Error removing product from cart:', error);
      return of(null);
    })
  ).subscribe();
}


// updatea el carrito  cuando sucede un cambio
  onQuantityChange(productId: string | undefined, quantity: number) {
  if (!productId || quantity < 1) return;

  this.cartService.updateProductQuantity(productId, quantity).pipe(
    tap(() => {
      const item = this.cartItems.find(i => i.details?.id === productId);
      if (item) item.quantity = quantity;
      this.calculateTotal(); 
    }),
    catchError((error) => {
      console.error('Error updating product quantity:', error);
      return of(null);
    })
  ).subscribe();
}


// lleva a la siguiente pagina
  onStartPurchase() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
      this.router.navigate(['loginPurchase']);
    } else {
      this.router.navigate(['shippingInfo']);
    }
  }

}
