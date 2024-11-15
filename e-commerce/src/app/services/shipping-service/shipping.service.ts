import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../../models/orders';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  private shippingDataSubject = new BehaviorSubject<Order | null>(this.getStoredShippingData());


  constructor() {}

  // Get the shipping data as an observable
  getShippingData() {
    return this.shippingDataSubject.asObservable();
  }

  // Set the shipping data and save it to localStorage
  setShippingData(data: Order) {
    this.shippingDataSubject.next(data);
    localStorage.setItem('shippingData', JSON.stringify(data)); // Save to localStorage
  }

  // Clear the shipping data (e.g., after order processing)
  clearShippingData() {
    this.shippingDataSubject.next(null);
    localStorage.removeItem('shippingData'); // Remove from localStorage
  }

  // Retrieve the stored shipping data from localStorage
  private getStoredShippingData(): Order | null {
    const storedData = localStorage.getItem('shippingData');
    return storedData ? JSON.parse(storedData) : null;
  }


  
}
