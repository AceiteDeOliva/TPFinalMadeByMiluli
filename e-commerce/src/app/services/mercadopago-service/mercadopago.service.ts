// mercadopago.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MercadopagoService {
  private apiUrl = 'http://localhost:8080/create_preference'; // Your backend API

  constructor(private http: HttpClient) {}

  createPreference(orderData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderData);
  }
}