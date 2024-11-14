// src/app/services/checkout-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutDataService {
  // BehaviorSubject to hold the total amount with an initial value of 0
  private totalAmountSubject = new BehaviorSubject<number>(0);

  // Setter method to update the total amount
  setTotalAmount(amount: number): void {
    this.totalAmountSubject.next(amount);
  }

  // Getter method to retrieve the total amount as an observable
  getTotalAmount(): Observable<number> {
    return this.totalAmountSubject.asObservable();
  }
}
