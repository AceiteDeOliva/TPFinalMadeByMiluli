import { Component } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import { Order } from '../../models/orders';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

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

  constructor(private userService: UserService) {}

  ngOnInit() {
    // Fetch all users and extract orders
    this.userService.getUser().subscribe((users: User[]) => {
      this.allUsers = users;
      this.allOrders = users.flatMap(user =>
        user.purchaseHistory.map(order => ({
          ...order,
          userId: user.id // Add userId explicitly
        }))
      );
    });
  }

  // Function to handle state change
  changeOrderState(order: Order & { userId: string }, newState: Order['state']): void {
    const originalState = order.state; // Save original state
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
  }
}
