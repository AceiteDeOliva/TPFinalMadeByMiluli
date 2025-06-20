import { User } from '../../models/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Order } from '../../models/orders';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}


  register(name: string, surname:string, email: string, password: string, credential: 'user' | 'employee' | 'manager' | 'admin'): Observable<boolean> {//Creates new user json
    return this.checkUserExists(email).pipe(
      switchMap((exists) => {
        if (exists) {
          return of(false);
        } else {
          const newUser: Omit<User, 'id'> = { name , surname, email, password, cart: [], purchaseHistory: [],favoriteList:[], credential};
          return this.http.post<User>(this.apiUrl, newUser).pipe(
            map(() => true),
            catchError(() => of(false))
          );
        }
      })
    );
  }


  authenticateUser(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      map((users) => {
        const user = users[0];
        const isValidUser = user && user.password === password;
        return isValidUser ? user : null;
      }),
      catchError(() => {
        console.error('Error fetching user data');
        return of(null);
      })
    );
  }


  private checkUserExists(email: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => users.length > 0)
    );
  }

  getUser(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching users:', error);
        return of([]);
      })
    );
  }

  getCredential(userId: string): Observable<string> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`).pipe(
      map((user: User) => {
        console.log('Fetched user:', user);
        return user.credential;
      }),
      catchError((error) => {
        console.error('Error fetching credential:', error);
        return of('');
      })
    );
}


  updateUser(userId: string, updatedFields: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, updatedFields).pipe(
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(() => new Error('Error updating user'));
      })
    );
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateOrderState(userId: string, orderId: string, newState: Order['state']): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/users/${userId}`).pipe(
      map((user) => {
        const order = user.purchaseHistory.find(o => o.orderId === orderId);
        if (!order) {
          throw new Error(`Order with ID ${orderId} not found for User ${userId}`);
        }
        order.state = newState;
        return user;
      }),
      switchMap((updatedUser) =>
        this.http.put<User>(`http://localhost:3000/users/${userId}`, updatedUser)
      )
    );
  }

  addOrderToPurchaseHistory(userId: string, order: Order): Observable<User> {
    return this.getUserById(userId).pipe(
      switchMap((user) => {

        const updatedUser = {
          ...user,
          purchaseHistory: [...user.purchaseHistory, order]
        };


        return this.updateUser(userId, { purchaseHistory: updatedUser.purchaseHistory });
      }),
      catchError((error) => {
        console.error('Error adding order to purchase history:', error);
        return throwError(() => new Error('Error adding order to purchase history'));
      })
    );
  }

  getPurchaseHistory(userId: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`).pipe(
      map((user) => user.purchaseHistory || []),
      catchError((error) => {
        console.error('Error fetching purchase history:', error);
        return throwError(() => error);
      })
    );
  }



}
