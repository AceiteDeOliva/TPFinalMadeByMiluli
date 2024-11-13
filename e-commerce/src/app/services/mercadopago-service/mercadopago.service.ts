// mercadopago.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MercadopagoService {
  private apiUrl = 'http://localhost:8080/create_preference';

  constructor(private http: HttpClient) {}

  // Accept a single object parameter for consistency
  createPreference(preferenceData: { title: string; quantity: number; unit_price: number }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, preferenceData, { headers });
  }
}
