import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrlProducts = 'http://localhost:3000/products';
  private apiUrlImages = 'http://localhost:3001/images';

  constructor(private http: HttpClient) { }


  // Agregar productos al JSON
  addProduct(
    name: string,
    description: string,
    price: number,
    category: string,
    stock: number,
    image: File
  ): Observable<boolean> {
    return this.checkProductExists(name).pipe(
      switchMap(exists => {
        if (exists) {
          return of(false); // Producto con el mismo nombre ya existe
        } else {
          // Sube la imagen y obtiene la URL
          return this.uploadImage(image).pipe(
            switchMap(imageUrl => {
              if (!imageUrl) {
                console.error('Error uploading image');
                return of(false);
              }
              // Genera el siguiente ID para el nuevo producto
              return this.generateNextId().pipe(
                switchMap(id => {
                  const newProduct: Omit<Product, 'id'> = {
                    name,
                    description,
                    price,
                    category,
                    stock,
                    imageUrl, // Usa la URL de la imagen
                    state: "active"
                  };
                  // Guarda el nuevo producto en el JSON de productos
                  return this.http.post<Product>(this.apiUrlProducts, { id, ...newProduct }).pipe(
                    map(() => true),
                    catchError(error => {
                      console.error('Error añadiendo producto:', error);
                      return of(false);
                    })
                  );
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
    return this.http.get<Product[]>(this.apiUrlProducts).pipe(
      map(products => {
        const highestId = products.reduce((maxId, product) => Math.max(product.id, maxId), 0);
        return highestId + 1;
      })
    );
  }

  // chequea si existe un productocon elmismonombre
  private checkProductExists(name: string): Observable<boolean> {
    return this.http.get<Product[]>(`${this.apiUrlProducts}?name=${name}`).pipe(
      map(product => product.length > 0)
    );
  }

  private SearchProduct(name: string) {
    return this.http.get<Product[]>(`${this.apiUrlProducts}?name=${name}`).pipe(
      map(products => (products.length > 0 ? products : null))
    );
  }

  //obtener los productos ded cierta categoria
  private SearchCategory(category: string) {
    const categoryArray: Product[] = [];
    return this.http.get<Product[]>(`${this.apiUrlProducts}?category=${category}`).pipe(
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
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrlProducts).pipe(
      catchError((error) => {
        console.error('Error fetching products:', error);
        return of([]); // Return an empty array in case of error
      })
    );
  }

// Método para subir una imagen y guardar su URL en images.json
uploadImage(file: File): Observable<string> {
  return new Observable(observer => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const base64String = reader.result as string; 
      const imageData = { data: base64String }; 
      
      // Envía la imagen al servidor JSON
      this.http.post<{ id: number }>(this.apiUrlImages, imageData).subscribe({
        next: (response) => {
          observer.next(this.apiUrlImages + '/' + response.id); 
          observer.complete();
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          observer.error(error);
        }
      });
    };

    reader.onerror = (error) => {
      observer.error(error);
    };

    reader.readAsDataURL(file); 
  });
}

  // Include the getImage method to fetch images by ID
  getImage(imageId: string): Observable<{ data: string }> {
    return this.http.get<{ data: string }>(`${this.apiUrlImages}/${imageId}`).pipe(
      catchError(error => {
        console.error('Error fetching image:', error);
        return of({ data: '' }); 
      })
    );
  }
}

