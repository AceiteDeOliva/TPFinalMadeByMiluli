import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError, of } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private currentUserId = localStorage.getItem('currentUserId');
  private userUrl = `http://localhost:3000/users/${this.currentUserId}`;
  private productsUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) { }

  // Fetch the cart items for the current user by getting the entire user object
  getCarrito(): Observable<{ productUrl: string; quantity: number }[]> {
    return this.http.get<User>(this.userUrl).pipe(
      map((user) => user.cart), // Extract the cart array from the user object
      catchError((error) => {
        alert('Error: No se encontró el carrito');
        return throwError(() => new Error(error));
      })
    );
  }

  // Add a product to the cart, either by updating quantity or adding new
  addProductToCart(productId: string, quantity: number = 1): Observable<any> {
    const productUrl = `${this.productsUrl}/${productId}`;

    return this.getCarrito().pipe(
      switchMap((cartItems) => {
        const existingProduct = this.findProductInCart(cartItems, productUrl);

        if (existingProduct) {
          this.updateProductQuantityInCart(cartItems, productUrl, quantity);
        } else {
          this.addNewProductToCart(cartItems, productUrl, quantity);
        }

        // Update the entire user object with the modified cart
        return this.updateCart(cartItems);
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

  // Update the quantity of an existing product in the cart
  private updateProductQuantityInCart(cart: Array<{ productUrl: string; quantity: number }>, productUrl: string, quantity: number): void {
    const existingProduct = this.findProductInCart(cart, productUrl);
    if (existingProduct) {
      existingProduct.quantity += quantity; // Increment the quantity
    }
  }

  // Add a new product to the cart
  private addNewProductToCart(cart: Array<{ productUrl: string; quantity: number }>, productUrl: string, quantity: number): void {
    cart.push({ productUrl, quantity });
  }

  // Update the user's cart by sending a PUT request to update the entire user object
  private updateCart(updatedCart: Array<{ productUrl: string; quantity: number }>): Observable<any> {
    return this.http.get<User>(this.userUrl).pipe(
      switchMap((user) => {
        const updatedUser = { ...user, cart: updatedCart };
        return this.http.put(this.userUrl, updatedUser);
      }),
      catchError((error) => {
        alert('Error: No se pudo actualizar el carrito');
        return throwError(() => error);
      })
    );
  }

  // Clear the cart by setting it to an empty array
  clearCart(): Observable<any> {
    return this.http.get<User>(this.userUrl).pipe(
      switchMap((user) => {
        const updatedUser = { ...user, cart: [] };
        return this.http.put(this.userUrl, updatedUser);
      }),
      catchError((error) => {
        alert('Error: no se pudo limpiar el carrito');
        return throwError(() => error);
      })
    );
  }
}
