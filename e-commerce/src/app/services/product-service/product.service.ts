import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) { }
  //Agregar productos al json
  addProduct(name: string, description: string, price: number, category: string, stock: number, image: string): Observable<boolean> {
    return this.checkProductExists(name).pipe(
      switchMap(exists => {
        if (exists) {
          return of(false); // Product with the same name exists
        } else {
          return this.generateNextId().pipe(
            switchMap(id => {
              const newProduct: Omit<Product, 'id'> = {
                name,
                description,
                price,
                category,
                stock,
                image,
                state: "active" 
              };
              return this.http.post<Product>(this.apiUrl, { id, ...newProduct }).pipe(
                map(() => true),
                catchError(error => {
                  console.error('Error adding product:', error); 
                  return of(false);
                })
              );
            })
          );
        }
      })
    );
  }

  // genera id secuencial
  private generateNextId(): Observable<number> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map(products => {
        const highestId = products.reduce((maxId, product) => Math.max(product.id, maxId), 0);
        return highestId + 1;
      })
    );
  }

  // chequea si existe un productocon elmismonombre
  private checkProductExists(name: string): Observable<boolean> {
    return this.http.get<Product[]>(`${this.apiUrl}?name=${name}`).pipe(
      map(product => product.length > 0)
    );
  }

  private SearchProduct(name: string) {
    return this.http.get<Product[]>(`${this.apiUrl}?name=${name}`).pipe(
      map(products => (products.length > 0 ? products : null))
    );
  }

  //obtener los productos ded cierta categoria
  private SearchCategory(category: string) {
    const categoryArray: Product[] = [];
    return this.http.get<Product[]>(`${this.apiUrl}?category=${category}`).pipe(
      map(products => {
        if (products.length > 0) {
          categoryArray.push(...products);
          return categoryArray;
        } else {
          return null;
        }
      })
    );
  }

  //Obtener todos los productos
  private getProduct(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching users:', error);
        return of([]);
      })
    );
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }


}
