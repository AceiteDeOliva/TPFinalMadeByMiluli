// src/app/services/checkout-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutDataService {
  private totalAmountSubject = new BehaviorSubject<number>(0);

  
  setTotalAmount(amount: number): void {
    this.totalAmountSubject.next(amount);
  }


  getTotalAmount(): Observable<number> {
    return this.totalAmountSubject.asObservable();
  }
}
