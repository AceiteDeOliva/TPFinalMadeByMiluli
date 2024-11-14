import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../../models/orders'; 

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private shippingDataSubject = new BehaviorSubject<Order | null>(null); // For storing form data as Order

  constructor() {}

  // Get the shipping data observable
  getShippingData() {
    return this.shippingDataSubject.asObservable();
  }

  // Set the shipping data
  setShippingData(data: Order) {
    this.shippingDataSubject.next(data);
  }
}
