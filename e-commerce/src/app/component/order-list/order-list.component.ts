import { Component } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import { Order } from '../../models/orders';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product-service/product.service';
import { map } from 'rxjs';
import { catchError,of,forkJoin } from 'rxjs';
import { CartItem } from '../../models/cartItem';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {
  allUsers: User[] = []; // All users
  allOrders: Order[] = []; // Extracted orders with userId

  constructor(
    private userService: UserService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.userService.getUser().subscribe((users: User[]) => {
      this.allUsers = users;

      // Flatten the purchase history with userId
      this.allOrders = users.flatMap(user =>
        user.purchaseHistory.map(order => ({
          ...order,
          userId: user.id
        }))
      );

      // Fetch product details for each order item
      this.updateOrderProducts();
    });
  }

  // Function to update product names in each order
  private updateOrderProducts(): void {
    const productRequests: Observable<CartItem>[] = []; // Explicitly define the type

    this.allOrders.forEach(order => {
      order.products.forEach(cartItem => {
        productRequests.push(
          this.productService.fetchProductWithoutImageByUrl(cartItem.productUrl).pipe(
            map((response) => {
              if (response.details) {
                // Assign the product name to the cartItem
                cartItem.productName = response.details.name;
              } else {
                console.error('Product details not found for URL:', cartItem.productUrl);
              }
              return cartItem; // Return the updated cartItem
            }),
            catchError(err => {
              console.error('Error fetching product for cart item:', err);
              return of(cartItem); // Return the cart item even in case of error
            })
          )
        );
      });
    });

    // Use forkJoin to wait for all product details to be fetched
    forkJoin(productRequests).subscribe({
      next: (updatedCartItems) => {
        console.log('Updated order products with product names:', this.allOrders);
      },
      error: (err) => {
        console.error('Error fetching product details for orders:', err);
      }
    });
  }

  // Function to handle state change
 /* changeOrderState(order: Order, newState: 'Pendiente' | 'Procesando' | 'Enviado' | 'Entregado' | 'Cancelado' | 'Devuelto' | 'Fallido' | 'Reembolsado'): void {
    const originalState = order.state;
    order.state = newState;

    this.userService.updateOrderState(order.userId, order.orderId, newState).subscribe({
      next: () => {
        console.log(`Order ${order.orderId} state updated to ${newState}`);
      },
      error: (err) => {
        console.error('Failed to update order state:', err);
        order.state = originalState; // Revert state on error
      }
    });
  }*/
}
