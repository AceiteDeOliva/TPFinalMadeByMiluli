import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  private apiUrl = 'https://rapidapi.com/brunoaramburu/api/correo-argentino1/playground/apiendpoint_eff0df8a-fc4a-4b70-9ecb-4310829c8318';  // Replace with actual endpoint

  constructor(private http: HttpClient) {}

  calculateShipping(cpOrigen: string, cpDestino: string, provinciaOrigen: string, provinciaDestino: string, peso: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-RapidAPI-Host': 'correo-argentino1.p.rapidapi.com',
      'X-RapidAPI-Key': '7961278fmshaf3f74457d4298dp18716jsndcc9c5131efe' // Replace securely
    });

    const params = new HttpParams()
      .set('cpOrigen', cpOrigen)
      .set('cpDestino', cpDestino)
      .set('provinciaOrigen', provinciaOrigen)
      .set('provinciaDestino', provinciaDestino)
      .set('peso', peso);

    return this.http.get(this.apiUrl, { headers, params });
  }
}
