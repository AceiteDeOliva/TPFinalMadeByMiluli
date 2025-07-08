import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  constructor(private http: HttpClient) {}

  private get currentUserId(): string | null {
    return localStorage.getItem('currentUserId');
  }

  private get userUrl(): string {
    if (!this.currentUserId) {
      throw new Error('No current user ID set.');
    }
    return `http://localhost:3000/users/${this.currentUserId}`;
  }

  getFavorites(): Observable<string[]> {
    if (this.currentUserId) {
      return this.http.get<User>(this.userUrl).pipe(
        map((user) => user.favoriteList || []),
        catchError((error) => {
          console.error('Error obteniendo favoritos:', error);
          return throwError(() => new Error('No se pudieron obtener los favoritos.'));
        })
      );
    } else {
      const guestFavs = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
      return of(guestFavs);
    }
  }

  toggleFavorite(itemId: string): Observable<string[]> {
    return this.getFavorites().pipe(
      switchMap((favs) => {
        const isFav = favs.includes(itemId);
        const updatedFavs = isFav ? favs.filter((id) => id !== itemId) : [...favs, itemId];

        if (this.currentUserId) {
          return this.http.get<User>(this.userUrl).pipe(
            switchMap((user) => {
              const updatedUser = { ...user, favoriteList: updatedFavs };
              return this.http.put<User>(this.userUrl, updatedUser).pipe(map(() => updatedFavs));
            })
          );
        } else {
          localStorage.setItem('guestFavorites', JSON.stringify(updatedFavs));
          return of(updatedFavs);
        }
      }),
      catchError((error) => {
        console.error('Error actualizando favoritos:', error);
        return throwError(() => new Error('No se pudo actualizar la lista de favoritos.'));
      })
    );
  }

  isFavorite(itemId: string): Observable<boolean> {
    return this.getFavorites().pipe(map((favs) => favs.includes(itemId)));
  }

  clearFavorites(): Observable<void> {
    if (this.currentUserId) {
      return this.http.get<User>(this.userUrl).pipe(
        switchMap((user) => {
          const updatedUser = { ...user, favoriteList: [] };
          return this.http.put(this.userUrl, updatedUser).pipe(map(() => void 0));
        }),
        catchError((error) => {
          alert('Error: no se pudo limpiar la lista de favoritos');
          return throwError(() => error);
        })
      );
    } else {
      localStorage.removeItem('guestFavorites');
      return of(void 0);
    }
  }


  syncGuestFavorites(userId: string): Observable<void> {
    const guestFavs: string[] = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
    if (guestFavs.length === 0) return of(void 0);

    const userUrl = `http://localhost:3000/users/${userId}`;

    return this.http.get<User>(userUrl).pipe(
      switchMap((user) => {
        const existingFavs = user.favoriteList || [];
        // Merge without duplicates
        const mergedFavs = Array.from(new Set([...existingFavs, ...guestFavs]));
        const updatedUser = { ...user, favoriteList: mergedFavs };
        return this.http.put(userUrl, updatedUser);
      }),
      switchMap(() => {
        localStorage.removeItem('guestFavorites');
        return of(void 0);
      }),
      catchError((error) => {
        console.error('Error syncing guest favorites:', error);
        return throwError(() => error);
      })
    );
  }
}
