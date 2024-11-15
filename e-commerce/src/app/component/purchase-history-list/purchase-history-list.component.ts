import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history-list.component.html',
  styleUrls: ['./purchase-history-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PurchaseHistoryComponent implements OnInit {
  purchaseHistory: any[] = [];
  userId: string | null = localStorage.getItem('currentUserId');

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.userService.getPurchaseHistory(this.userId).subscribe({
        next: (history) => {
          this.purchaseHistory = history;
          console.log('Purchase history:', this.purchaseHistory);
        },
        error: (err) => {
          console.error('Error fetching purchase history:', err);
        },
      });
    } else {
      console.error('User ID is missing.');
    }
  }
}
