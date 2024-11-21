import { Component } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import { Order } from '../../models/orders';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product-service/product.service';
import { map } from 'rxjs';
import { catchError, of, forkJoin } from 'rxjs';
import { CartItem } from '../../models/cartItem';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent {
  allUsers: User[] = []; // All users
  allOrders: { order: Order; userId: string }[] = []; // Keep userId separately with each order
  filteredOrders: { order: Order; userId: string }[] = []; // Filtered orders to display
  filterStatus: string = ''; // Current status filter

  constructor(
    private userService: UserService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.userService.getUser().subscribe((users: User[]) => {
      this.allUsers = users;

      // Create orders with userId separately
      this.allOrders = users.flatMap(user =>
        user.purchaseHistory.map(order => ({
          order,
          userId: user.id
        }))
      );

      // Initialize filteredOrders with all orders
      this.filteredOrders = [...this.allOrders];

      // Fetch product details for each order item
      this.updateOrderProducts();
    });
  }

  // Filter orders by status
  filterOrders(): void {
    if (this.filterStatus) {
      this.filteredOrders = this.allOrders.filter(entry => entry.order.state === this.filterStatus);
    } else {
      this.filteredOrders = [...this.allOrders]; // Reset to all orders if no filter
    }
  }

  // Function to update product names in each order
  private updateOrderProducts(): void {
    const productRequests: Observable<CartItem>[] = []; // Explicitly define the type

    this.allOrders.forEach(({ order }) => {
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
  changeOrderState(order: Order, userId: string, event: Event): void {
    const newState = (event.target as HTMLSelectElement).value as Order['state']; // Extract the selected value and cast type
  
    console.log(`Attempting to change state of Order ${order.orderId} to ${newState}`);
  
    const originalState = order.state; // Save original state in case of error
    order.state = newState; // Optimistically update the UI
  
    // Call the service to persist the state change
    this.userService.updateOrderState(userId, order.orderId, newState).subscribe({
      next: () => {
        console.log(`Order ${order.orderId} state successfully updated to ${newState}`);
      },
      error: (err) => {
        console.error(`Failed to update order ${order.orderId} state:`, err);
        alert(`No se pudo actualizar el estado. Inténtalo nuevamente.`);
        order.state = originalState; // Rollback state in case of failure
      }
    });
  }
}
