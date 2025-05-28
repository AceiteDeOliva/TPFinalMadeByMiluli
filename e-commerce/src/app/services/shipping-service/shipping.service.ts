import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from '../../models/orders';
import { CorreoArgentinoResponse } from '../../models/correo-argentino-response';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  private backendUrl = 'http://localhost:8080'; // La URL de tu servidor Express
  private shippingDataSubject = new BehaviorSubject<Order | null>(this.getStoredShippingData());

  constructor(private http: HttpClient) {}


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


  calculateCorreoArgentinoPrice(data: { cpDestino: string; provinciaDestino: string }): Observable<CorreoArgentinoResponse> {
    return this.http.post<CorreoArgentinoResponse>(`${this.backendUrl}/calculate_shipping_price`, data);
  }

}
