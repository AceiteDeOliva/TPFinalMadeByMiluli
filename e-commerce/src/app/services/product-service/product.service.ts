import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrlProducts = 'http://localhost:3000/products';
  private apiUrlImages = 'http://localhost:3001/images';

  constructor(private http: HttpClient) { }



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
          return of(false);
        } else {

          return this.uploadImage(image).pipe(
            switchMap(imageUrl => {
              if (!imageUrl) {
                console.error('Error uploading image');
                return of(false);
              }

              return this.generateNextId().pipe(
                switchMap(id => {
                  const newProduct: Product = {
                    id,
                    name,
                    description,
                    price,
                    category,
                    stock,
                    imageUrl,
                    state: "active"
                  };

                  return this.http.post<Product>(this.apiUrlProducts, newProduct).pipe(
                    map(() => true),
                    catchError(error => {
                      console.error('Error adding product:', error);
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


  private generateNextId(): Observable<string> {
    return this.http.get<Product[]>(this.apiUrlProducts).pipe(
      map(products => {

        const highestId = products.reduce((maxId, product) => {
          const numericId = parseInt(product.id, 10);
          return isNaN(numericId) ? maxId : Math.max(maxId, numericId);
        }, 0);


        const nextId = (highestId + 1).toString();
        return nextId;
      })
    );
  }



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



  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrlProducts).pipe(
      catchError((error) => {
        console.error('Error fetching products:', error);
        return of([]);
      })
    );
  }


uploadImage(file: File): Observable<string> {
  return new Observable(observer => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      const imageData = { data: base64String };


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


  getImage(imageId: string): Observable<{ data: string }> {
    return this.http.get<{ data: string }>(`${this.apiUrlImages}/${imageId}`).pipe(
      catchError(error => {
        console.error('Error fetching image:', error);
        return of({ data: '' });
      })
    );
  }

  getProductById(id: string): Observable<Product | null> {
    return this.http.get<Product>(`${this.apiUrlProducts}/${id}`).pipe(
      map((product) => product),
      catchError((error) => {
        console.error(`Error fetching product with ID ${id}:`, error);
        return of(null);
      })
    );
  }


  updateProduct(updatedProduct: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrlProducts}/${updatedProduct.id}`, updatedProduct).pipe(
      catchError(error => {
        console.error('Error updating product:', error);
        throw error;
      })
    );
  }


  deleteImage(imageId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlImages}/${imageId}`).pipe(
      catchError(error => {
        console.error('Error deleting image:', error);
        return of(undefined);
      })
    );
  }

  deleteProduct(product: Product): Observable<void> {

    const imageId = product.imageUrl.split('/').pop() || '';
    return this.deleteImage(imageId).pipe(
      switchMap(() => {
        return this.http.delete<void>(`${this.apiUrlProducts}/${product.id}`);
      }),
      catchError(error => {
        alert('Error deleting product or associated image');
        console.error('Error:', error);
        return of(undefined);
      })
    );
  }


  getTopStockProducts(topN: number): Observable<string[]> {
    return this.getProducts().pipe(
      map((products) => {

        return products
          .filter(product => product.stock > 0)
          .sort((a, b) => b.stock - a.stock)
          .slice(0, topN)
          .map(product => `/productView/${product.id}`);
      })
    );
  }

  fetchProductWithoutImageByUrl(productUrl: string): Observable<{ details: Product | null; productUrl: string }> {
    const productId = productUrl.split('/').pop();
    if (!productId) return of({ details: null, productUrl });

    return this.getProductById(productId).pipe(
      map(product => {
        return { details: product, productUrl };
      }),
      catchError(error => {
        console.error(`Error al obtener el producto con ID ${productId}:`, error);
        return of({ details: null, productUrl });
      })
    );
  }



  fetchProductWithImageByUrl(productUrl: string): Observable<{ details: Product | null; productUrl: string }> {
    const productId = productUrl.split('/').pop();
    if (!productId) return of({ details: null, productUrl });

    return this.getProductById(productId).pipe(
      switchMap(product => {
        if (!product) return of({ details: null, productUrl });

        const imageId = product.imageUrl.split('/').pop();
        if (imageId) {
          return this.getImage(imageId).pipe(
            map(imageData => {
              if (imageData?.data) {
                product.imageUrl = imageData.data;
              }
              return { details: product, productUrl };
            }),
            catchError(error => {
              console.error(`Error loading image for product ${product.id}:`, error);
              return of({ details: product, productUrl });
            })
          );
        }

        return of({ details: product, productUrl });
      }),
      catchError(error => {
        console.error(`Error fetching product with ID ${productId}:`, error);
        return of({ details: null, productUrl });
      })
    );
  }


}




