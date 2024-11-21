import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../../models/orders';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  private shippingDataSubject = new BehaviorSubject<Order | null>(this.getStoredShippingData());


  constructor() {}


  getShippingData() {
    return this.shippingDataSubject.asObservable();
  }


  setShippingData(data: Order) {
    this.shippingDataSubject.next(data);
    localStorage.setItem('shippingData', JSON.stringify(data));
  }


  clearShippingData() {
    this.shippingDataSubject.next(null);
    localStorage.removeItem('shippingData');
  }

  
  private getStoredShippingData(): Order | null {
    const storedData = localStorage.getItem('shippingData');
    return storedData ? JSON.parse(storedData) : null;
  }



}
