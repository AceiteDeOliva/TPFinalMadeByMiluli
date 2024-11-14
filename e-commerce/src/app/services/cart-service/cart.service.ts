import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError, of } from 'rxjs';
import { User } from '../../models/user';
import { CartItem } from '../../models/cartItem';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private currentUserId = localStorage.getItem('currentUserId');
  private userUrl = `http://localhost:3000/users/${this.currentUserId}`;
  private productsUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) { }

  // Fetch the cart items for the current user or from localStorage if guest
  getCarrito(): Observable<{ productUrl: string; quantity: number }[]> {
    if (this.currentUserId) {

      return this.http.get<User>(this.userUrl).pipe(
        map((user) => user.cart), // Extract the cart array from the user object
        catchError((error) => {
          alert('Error: No se encontró el carrito');
          return throwError(() => new Error(error));
        })
      );
    } else {
      // If guest, fetch cart from localStorage
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      return of(guestCart);
    }
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

        // Update the cart in localStorage for guests or on backend for logged-in users
        if (this.currentUserId) {
          return this.updateCart(cartItems); // Update cart on backend
        } else {
          this.saveGuestCart(cartItems); // Save cart to localStorage for guest
          return of(null);
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

 
  private updateProductQuantityInCart(cart: Array<{ productUrl: string; quantity: number }>, productUrl: string, quantity: number): void {
    const existingProduct = this.findProductInCart(cart, productUrl);
    if (existingProduct) {
      existingProduct.quantity += quantity; // Increment the quantity
    }
  }


  private addNewProductToCart(cart: Array<{ productUrl: string; quantity: number }>, productUrl: string, quantity: number): void {
    cart.push({ productUrl, quantity });
  }


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

  // Remove a product from the cart
  removeProductFromCart(productId: string): Observable<any> {
    const productUrl = `${this.productsUrl}/${productId}`;

    return this.getCarrito().pipe(
      switchMap((cartItems) => {
        const updatedCart = cartItems.filter(item => item.productUrl !== productUrl);

        if (this.currentUserId) {
          return this.updateCart(updatedCart);
        } else {
          this.saveGuestCart(updatedCart);
          return of(null);
        }
      }),
      catchError((error) => {
        alert('Error: No se pudo eliminar el producto del carrito');
        return throwError(() => error);
      })
    );
  }

  // Update product quantity in the cart
  updateProductQuantity(productId: string, quantity: number): Observable<any> {
    return this.getCarrito().pipe(
      switchMap((cartItems) => {
        const updatedCart = cartItems.map(item =>
          item.productUrl.endsWith(productId) ? { ...item, quantity } : item
        );

        if (this.currentUserId) {
          return this.updateCart(updatedCart);
        } else {
          this.saveGuestCart(updatedCart);
          return of(null);
        }
      }),
      catchError((error) => {
        alert('Error: No se pudo actualizar la cantidad del producto');
        return throwError(() => error);
      })
    );
  }

  // Calculate the total price of the cart
  getTotalCompra(): Observable<number> {
    return this.getCarrito().pipe(
      switchMap(cartItems => {
        const productIds = cartItems.map(item => item.productUrl.split('/').pop()); // Extract the product IDs
        return this.http.get<any[]>(`${this.productsUrl}?id_in=${productIds.join(',')}`).pipe(
          map(products => {
            let total = 0;
            cartItems.forEach(item => {
              const product = products.find(p => p.id === item.productUrl.split('/').pop());
              if (product) {
                total += product.price * item.quantity; // Calculate total price
              }
            });
            return total;
          }),
          catchError(error => {
            alert('Error: No se pudo calcular el total de la compra');
            return throwError(() => error);
          })
        );
      })
    );
  }

  // Sync the guest cart with the logged-in user's cart
  syncGuestCart(userId: string): Observable<any> {
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');

    if (guestCart.length > 0) {
      return this.http.get<User>(`http://localhost:3000/users/${userId}`).pipe(
        switchMap((user) => {
          const updatedUser = { ...user, cart: guestCart };
          return this.http.put(`http://localhost:3000/users/${userId}`, updatedUser);
        }),
        switchMap(() => {
          localStorage.removeItem('guestCart');
          return of(null);
        }),
        catchError((error) => {
          console.error('Error syncing guest cart:', error);
          return throwError(() => error);
        })
      );
    } else {
      return of(null);
    }
  }

  // Save the cart to localStorage for guest users
  private saveGuestCart(cart: CartItem[]): void {
    localStorage.setItem('guestCart', JSON.stringify(cart));
  }
}
