import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs';
import { ProductService } from '../../services/product-service/product.service';
import { Order } from '../../models/orders';
import { User } from '../../models/user';
@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history-list.component.html',
  styleUrls: ['./purchase-history-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PurchaseHistoryComponent implements OnInit {
  purchaseHistory: Order[] = [];
  userId: string | null = localStorage.getItem('currentUserId');


  constructor(
    private userService: UserService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    if (this.userId) {
      this.userService.getPurchaseHistory(this.userId).subscribe({
        next: (history) => {
          this.purchaseHistory = history;


          this.purchaseHistory.forEach(order => {
            order.products.forEach(cartItem => {

              this.productService.fetchProductWithoutImageByUrl(cartItem.productUrl).subscribe({
                next: (response) => {

                  if (response.details) {
                    cartItem.productName = response.details.name; 
                  } else {
                    console.error('Product details not found for URL:', cartItem.productUrl);
                  }
                },
                error: (err) => {
                  console.error('Error fetching product for cart item:', err);
                }
              });
            });
          });

          console.log('Purchase history:', this.purchaseHistory);
        },
        error: (err) => {
          console.error('Error fetching purchase history:', err);
        }
      });
    } else {
      console.error('User ID is missing.');
    }
  }

  updateOrderState(orderId: string, newState: Order['state']): void {
    if (this.userId) {
      this.userService.updateOrderState(this.userId, orderId, newState).subscribe({
        next: (updatedUser) => {
          const order = this.purchaseHistory.find(order => order.orderId === orderId);
          if (order) {
            order.state = newState;
          }
          console.log('Order state updated successfully');
        },
        error: (err) => {
          console.error('Error updating order state:', err);
        }
      });
    } else {
      console.error('User ID is missing.');
    }
  }

}
