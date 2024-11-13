import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MercadopagoService {

  private apiUrl = 'http://localhost:3002/create_preference'; // URL de tu servidor Node.js

  constructor(private http: HttpClient) { }

  createPreference(title: string, quantity: number, unitPrice: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { title, quantity, unit_price: unitPrice };
    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
