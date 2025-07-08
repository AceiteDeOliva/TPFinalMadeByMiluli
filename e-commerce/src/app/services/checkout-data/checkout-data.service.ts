import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutDataService {
  private totalAmountSubject = new BehaviorSubject<number>(0);
  private subtotalSubject = new BehaviorSubject<number>(0);
  private shippingCostSubject = new BehaviorSubject<number>(0);


  setTotalAmount(amount: number): void {
    this.totalAmountSubject.next(amount);
  }

  getTotalAmount(): Observable<number> {
    return this.totalAmountSubject.asObservable();
  }


  setSubtotal(amount: number): void {
    this.subtotalSubject.next(amount);
  }

  getSubtotal(): Observable<number> {
    return this.subtotalSubject.asObservable();
  }

  setShippingCost(amount: number): void {
    this.shippingCostSubject.next(amount);
  }

  getShippingCost(): Observable<number> {
    return this.shippingCostSubject.asObservable();
  }
}
