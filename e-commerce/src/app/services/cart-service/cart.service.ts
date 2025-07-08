import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError, of, BehaviorSubject, tap } from 'rxjs';
import { User } from '../../models/user';
import { CartItem } from '../../models/cartItem';
import { ProductService } from '../product-service/product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private productsUrl = 'http://localhost:3000/products';
  private subtotalSubject = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient, private productService: ProductService) { }

  getSubtotal(): Observable<number> {
    return this.subtotalSubject.asObservable();
  }

  private recalculateSubtotal(): void {
    this.getTotalCompra().subscribe(total => {
      this.subtotalSubject.next(total);
    });
  }

  private get currentUserId(): string | null {
    return localStorage.getItem('currentUserId');
  }

  private get userUrl(): string {
    if (!this.currentUserId) {
      throw new Error('No current user ID set.');
    }
    return `http://localhost:3000/users/${this.currentUserId}`;
  }

  getCarrito(): Observable<CartItem[]> {
    if (this.currentUserId) {
      return this.http.get<User>(this.userUrl).pipe(
        map(user => user.cart),
        catchError(error => {
          alert('Error: No se encontró el carrito');
          return throwError(() => new Error(error));
        })
      );
    } else {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      return of(guestCart);
    }
  }

  addProductToCart(productId: string, quantity: number = 1): Observable<{ message: string }> {
    const productUrl = `${this.productsUrl}/${productId}`;

    return this.getCarrito().pipe(
      switchMap(cartItems =>
        this.productService.getProductById(productId).pipe(
          switchMap(product => {
            if (!product) return of({ message: 'Error: Producto no encontrado.' });

            const existingProduct = this.findProductInCart(cartItems, productUrl);
            const totalQuantity = existingProduct ? existingProduct.quantity + quantity : quantity;

            if (totalQuantity > product.stock) {
              return of({ message: 'Error: La cantidad solicitada supera el stock disponible.' });
            }

            if (existingProduct) {
              this.updateProductQuantityInCart(cartItems, productUrl, quantity);
            } else {
              this.addNewProductToCart(cartItems, productUrl, quantity);
            }

            if (this.currentUserId) {
              return this.updateCart(cartItems).pipe(
                tap(() => this.recalculateSubtotal()),
                map(() => ({ message: 'Producto agregado al carrito exitosamente.' }))
              );
            } else {
              this.saveGuestCart(cartItems);
              this.recalculateSubtotal();
              return of({ message: 'Producto agregado al carrito exitosamente.' });
            }
          })
        )
      ),
      catchError(() => of({ message: 'Error: No se pudo agregar el producto al carrito.' }))
    );
  }

  reduceStock(productId: string, quantity: number): Observable<any> {
    const productUrl = `${this.productsUrl}/${productId}`;
    return this.http.get<any>(productUrl).pipe(
      switchMap(product => {
        if (product.stock < quantity) {
          return throwError(() => new Error('Stock insufficient.'));
        }
        const updatedStock = product.stock - quantity;
        return this.http.put(productUrl, { ...product, stock: updatedStock });
      }),
      catchError(err => {
        console.error('Error reducing stock for product:', productId, err);
        return throwError(() => err);
      })
    );
  }

  private findProductInCart(cart: CartItem[], productUrl: string) {
    return cart.find(item => item.productUrl === productUrl);
  }

  private updateProductQuantityInCart(cart: CartItem[], productUrl: string, quantity: number): void {
    const existingProduct = this.findProductInCart(cart, productUrl);
    if (existingProduct) existingProduct.quantity += quantity;
  }

  private addNewProductToCart(cart: CartItem[], productUrl: string, quantity: number): void {
    cart.push({ productUrl, quantity });
  }

  private updateCart(updatedCart: CartItem[]): Observable<any> {
    if (!this.currentUserId) return throwError(() => new Error('No current user for updateCart'));

    return this.http.get<User>(this.userUrl).pipe(
      switchMap(user => {
        const updatedUser = { ...user, cart: updatedCart };
        return this.http.put(this.userUrl, updatedUser);
      }),
      catchError(error => {
        alert('Error: No se pudo actualizar el carrito');
        return throwError(() => error);
      })
    );
  }

  clearCart(): Observable<any> {
    if (!this.currentUserId) return of(null);

    return this.http.get<User>(this.userUrl).pipe(
      switchMap(user => {
        const updatedUser = { ...user, cart: [] };
        return this.http.put(this.userUrl, updatedUser);
      }),
      tap(() => this.recalculateSubtotal()),
      catchError(error => {
        alert('Error: no se pudo limpiar el carrito');
        return throwError(() => error);
      })
    );
  }

  removeProductFromCart(productId: string): Observable<any> {
    const productUrl = `${this.productsUrl}/${productId}`;
    return this.getCarrito().pipe(
      switchMap(cartItems => {
        const updatedCart = cartItems.filter(item => item.productUrl !== productUrl);
        if (this.currentUserId) {
          return this.updateCart(updatedCart).pipe(
            tap(() => this.recalculateSubtotal())
          );
        } else {
          this.saveGuestCart(updatedCart);
          this.recalculateSubtotal();
          return of(null);
        }
      }),
      catchError(error => {
        alert('Error: No se pudo eliminar el producto del carrito');
        return throwError(() => error);
      })
    );
  }

  updateProductQuantity(productId: string, quantity: number): Observable<any> {
    return this.getCarrito().pipe(
      switchMap(cartItems => {
        const updatedCart = cartItems.map(item =>
          item.productUrl.endsWith(productId) ? { ...item, quantity } : item
        );

        if (this.currentUserId) {
          return this.updateCart(updatedCart).pipe(
            tap(() => this.recalculateSubtotal())
          );
        } else {
          this.saveGuestCart(updatedCart);
          this.recalculateSubtotal();
          return of(null);
        }
      }),
      catchError(error => {
        alert('Error: No se pudo actualizar la cantidad del producto');
        return throwError(() => error);
      })
    );
  }

  getTotalCompra(): Observable<number> {
    return this.getCarrito().pipe(
      switchMap(cartItems => {
        const productIds = cartItems.map(item => item.productUrl.split('/').pop());
        return this.http.get<any[]>(`${this.productsUrl}?id_in=${productIds.join(',')}`).pipe(
          map(products => {
            let total = 0;
            cartItems.forEach(item => {
              const productId = item.productUrl.split('/').pop();
              const product = products.find(p => p.id === productId);
              if (product) total += product.price * item.quantity;
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

  syncGuestCart(userId: string): Observable<any> {
    const guestCart: CartItem[] = JSON.parse(localStorage.getItem('guestCart') || '[]');
    if (guestCart.length === 0) return of(null);

    return this.http.get<User>(`http://localhost:3000/users/${userId}`).pipe(
      switchMap(user => {
        const existingCart = user.cart || [];

        const mergedCart: CartItem[] = [...existingCart];

        guestCart.forEach(guestItem => {
          const existingItem = mergedCart.find(item => item.productUrl === guestItem.productUrl);
          if (existingItem) {
            existingItem.quantity += guestItem.quantity;
          } else {
            mergedCart.push(guestItem);
          }
        });

        const updatedUser = { ...user, cart: mergedCart };
        return this.http.put(`http://localhost:3000/users/${userId}`, updatedUser);
      }),
      tap(() => this.recalculateSubtotal()),
      switchMap(() => {
        localStorage.removeItem('guestCart');
        return of(null);
      }),
      catchError(error => {
        console.error('Error syncing guest cart:', error);
        return throwError(() => error);
      })
    );
  }

  private saveGuestCart(cart: CartItem[]): void {
    localStorage.setItem('guestCart', JSON.stringify(cart));
  }
}