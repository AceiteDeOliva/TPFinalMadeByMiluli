import { User } from './../../models/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private currentUserId = localStorage.getItem('currentUserId');
  private userUrl = `http://localhost:3000/users/${this.currentUserId}`;
 



  constructor(private http: HttpClient) {}

  getFavorites(): Observable<string[]> {
    if (this.currentUserId) {
      return this.http.get<User>(this.userUrl).pipe(
        map(user => user.favoriteList),
        catchError(error => {
          console.error('Error obteniendo favoritos:', error);
          return throwError(() => new Error('No se pudieron obtener los favoritos.'));
        })
      );
    } else {
      const guestFavs = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
      return of(guestFavs);
    }
  }

  toggleFavorite(string: string): Observable<string[]> {
    return this.getFavorites().pipe(
      switchMap(favs => {
        const isFav = favs.includes(string);
        const updatedFavs = isFav
          ? favs.filter(id => id !== string)
          : [...favs, string];

        if (this.currentUserId) {
          return this.http.get<User>(this.userUrl).pipe(
            switchMap(user => {
              const updatedUser = { ...user, favoriteList: updatedFavs };
              return this.http.put<User>(this.userUrl, updatedUser).pipe(
                map(() => updatedFavs)
              );
            })
          );
        } else {
          localStorage.setItem('guestFavorites', JSON.stringify(updatedFavs));
          return of(updatedFavs);
        }
      }),
      catchError(error => {
        console.error('Error actualizando favoritos:', error);
        return throwError(() => new Error('No se pudo actualizar la lista de favoritos.'));
      })
    );
  }

  isFavorite(string: string): Observable<boolean> {
    return this.getFavorites().pipe(
      map(favs => favs.includes(string))
    );
  }


  clearFavorites(): Observable<void> {
    if (this.currentUserId) {
      return this.http.get<User>(this.userUrl).pipe(
        switchMap(user => {
          const updatedUser = { ...user, favoriteList: [] };
          return this.http.put(this.userUrl, updatedUser).pipe(
            map(() => void 0)
          );
        })
      );
    } else {
      localStorage.removeItem('guestFavorites');
      return of(void 0);
    }
  }
}
