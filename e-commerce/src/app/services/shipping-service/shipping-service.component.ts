import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private shippingDataSubject = new BehaviorSubject<any>(null); // For storing form data
  private shippingCostSubject = new BehaviorSubject<number>(0); // For storing shipping cost

  constructor() {}

  // Get the shipping data observable
  getShippingData() {
    return this.shippingDataSubject.asObservable();
  }

  // Get the shipping cost observable
  getShippingCost() {
    return this.shippingCostSubject.asObservable();
  }

  // Set the shipping data
  setShippingData(data: any) {
    this.shippingDataSubject.next(data);
  }

  // Set the shipping cost
  setShippingCost(cost: number) {
    this.shippingCostSubject.next(cost);
  }
}
