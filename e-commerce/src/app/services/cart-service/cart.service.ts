import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private currentUserId = localStorage.getItem('currentUserId'); 
  private userCartUrl = `http://localhost:3000/users/${this.currentUserId}/cart`;  
  private productsUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getCarrito(): Observable<any> {
    return this.http.get(this.userCartUrl).pipe(
      catchError((error) => {
        alert('Error: No se encontró el carrito');
        return throwError(() => new Error(error));
      })
    );
  }

  // Method to add a product to the cart using the product URL
  addProductToCart(productId: string, quantity: number = 1): Observable<any> {
    const productUrl = `${this.productsUrl}/${productId}`;

    return this.getCarrito().pipe(
      map((user: User) => {
        const existingProduct = this.findProductInCart(user.cart, productUrl);

        if (existingProduct) {
          // If the product exists, delegate the quantity update
          this.updateProductQuantityInCart(user.cart, productUrl, quantity);
          return this.updateCart(user.cart); // Update cart with the new quantity
        } else {
          // If the product doesn't exist, add it to the cart
          return this.addNewProductToCart(user.cart, productUrl, quantity);
        }
      }),
      catchError((error) => {
        alert('Error: No se pudo agregar el producto al carrito');
        return throwError(() => error);
      })
    );
  }

  // Helper function to find an existing product in the cart
  private findProductInCart(cart: Array<{ productUrl: string; quantity: number }>, productUrl: string) {
    return cart.find(item => item.productUrl === productUrl);
  }

  // Method to update the quantity of an existing product in the cart
  private updateProductQuantityInCart(cart: Array<{ productUrl: string; quantity: number }>, productUrl: string, quantity: number): void {
    const existingProduct = this.findProductInCart(cart, productUrl);
    if (existingProduct) {
      existingProduct.quantity += quantity; // Increment the quantity
    }
  }

  // Method to add a new product to the cart
  private addNewProductToCart(cart: Array<{ productUrl: string; quantity: number }>, productUrl: string, quantity: number): Observable<any> {
    const newProduct = { productUrl, quantity };
    cart.push(newProduct);

    // Send a POST request to add the new product to the server 
    return this.http.post(this.userCartUrl, newProduct).pipe(
      catchError((error) => {
        alert('Error: No se pudo agregar el producto al carrito');
        return throwError(() => error);
      })
    );
  }

  // Method to update the cart 
  private updateCart(updatedCart: Array<{ productUrl: string; quantity: number }>): Observable<any> {
    return this.http.patch(this.userCartUrl, { cart: updatedCart }).pipe(
      catchError((error) => {
        alert('Error: No se pudo actualizar el carrito');
        return throwError(() => error);
      })
    );
  }


}
