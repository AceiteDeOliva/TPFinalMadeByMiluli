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
  allUsers: User[] = []; 
  allOrders: { order: Order; userId: string }[] = [];
  filteredOrders: { order: Order; userId: string }[] = [];
  filterStatus: string = '';

  constructor(
    private userService: UserService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.userService.getUser().subscribe((users: User[]) => {
      this.allUsers = users;


      this.allOrders = users.flatMap(user =>
        user.purchaseHistory.map(order => ({
          order,
          userId: user.id
        }))
      );


      this.filteredOrders = [...this.allOrders];


      this.updateOrderProducts();
    });
  }


  filterOrders(): void {
    if (this.filterStatus) {
      this.filteredOrders = this.allOrders.filter(entry => entry.order.state === this.filterStatus);
    } else {
      this.filteredOrders = [...this.allOrders];
    }
  }


  private updateOrderProducts(): void {
    const productRequests: Observable<CartItem>[] = [];

    this.allOrders.forEach(({ order }) => {
      order.products.forEach(cartItem => {
        productRequests.push(
          this.productService.fetchProductWithoutImageByUrl(cartItem.productUrl).pipe(
            map((response) => {
              if (response.details) {

                cartItem.productName = response.details.name;
              } else {
                console.error('Product details not found for URL:', cartItem.productUrl);
              }
              return cartItem;
            }),
            catchError(err => {
              console.error('Error fetching product for cart item:', err);
              return of(cartItem);
            })
          )
        );
      });
    });


    forkJoin(productRequests).subscribe({
      next: (updatedCartItems) => {
        console.log('Updated order products with product names:', this.allOrders);
      },
      error: (err) => {
        console.error('Error fetching product details for orders:', err);
      }
    });
  }


  changeOrderState(order: Order, userId: string, event: Event): void {
    const newState = (event.target as HTMLSelectElement).value as Order['state'];

    console.log(`Attempting to change state of Order ${order.orderId} to ${newState}`);

    const originalState = order.state;
    order.state = newState;


    this.userService.updateOrderState(userId, order.orderId, newState).subscribe({
      next: () => {
        console.log(`Order ${order.orderId} state successfully updated to ${newState}`);
      },
      error: (err) => {
        console.error(`Failed to update order ${order.orderId} state:`, err);
        alert(`No se pudo actualizar el estado. Inténtalo nuevamente.`);
        order.state = originalState;
      }
    });
  }
}
