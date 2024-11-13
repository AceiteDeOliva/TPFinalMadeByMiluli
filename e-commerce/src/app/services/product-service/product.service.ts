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
              // Generate the next ID for the new product
              return this.generateNextId().pipe(
                switchMap(id => {
                  const newProduct: Product = {
                    id, // Use the generated string ID here
                    name,
                    description,
                    price,
                    category,
                    stock,
                    imageUrl, // Use the URL of the uploaded image
                    state: "active"
                  };
                  // Save the new product to the JSON of products
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

  // genera id secuencial
  private generateNextId(): Observable<string> {
    return this.http.get<Product[]>(this.apiUrlProducts).pipe(
      map(products => {
        // Find the highest numeric ID by converting each to a number
        const highestId = products.reduce((maxId, product) => {
          const numericId = parseInt(product.id, 10); // Convert ID to a number
          return isNaN(numericId) ? maxId : Math.max(maxId, numericId);
        }, 0);

        // Generate the next ID and convert it to a string
        const nextId = (highestId + 1).toString();
        return nextId;
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
        return of([]);
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

  getProductById(id: string): Observable<Product | null> {
    return this.http.get<Product>(`${this.apiUrlProducts}/${id}`).pipe(
      map((product) => product),
      catchError((error) => {
        console.error(`Error fetching product with ID ${id}:`, error);
        return of(null);
      })
    );
  }


  updateProduct(updatedProduct: Product): Observable<Product> { //updates product
    return this.http.put<Product>(`${this.apiUrlProducts}/${updatedProduct.id}`, updatedProduct).pipe(
      catchError(error => {
        console.error('Error updating product:', error);
        throw error;
      })
    );
  }


  deleteImage(imageId: string): Observable<void> { //deletes image from images.json by id
    return this.http.delete<void>(`${this.apiUrlImages}/${imageId}`).pipe(
      catchError(error => {
        console.error('Error deleting image:', error);
        return of(undefined);
      })
    );
  }

  deleteProduct(product: Product): Observable<void> { //deletes the product

    const imageId = product.imageUrl.split('/').pop() || '';//gets the image ID
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
        // Filter products with stock > 0, sort by descending stock, and slice to get top N
        return products
          .filter(product => product.stock > 0) // Ensure that the product has stock
          .sort((a, b) => b.stock - a.stock) // Sort in descending order by stock
          .slice(0, topN) // Take the top N products
          .map(product => `/productView/${product.id}`); // Return URLs to the product page
      })
    );
  }




  fetchProductWithImageByUrl(productUrl: string): Observable<{ details: Product | null; productUrl: string }> {
    const productId = productUrl.split('/').pop();
    if (!productId) return of({ details: null, productUrl }); // Return null if productId is invalid

    return this.getProductById(productId).pipe( // Use `getProductById` directly
      switchMap(product => {
        if (!product) return of({ details: null, productUrl });

        const imageId = product.imageUrl.split('/').pop();
        if (imageId) {
          return this.getImage(imageId).pipe( // Use `getImage` directly
            map(imageData => {
              if (imageData?.data) {
                product.imageUrl = imageData.data; // Update image URL
              }
              return { details: product, productUrl };
            }),
            catchError(error => {
              console.error(`Error loading image for product ${product.id}:`, error);
              return of({ details: product, productUrl });
            })
          );
        }

        return of({ details: product, productUrl }); // Return product if no image ID
      }),
      catchError(error => {
        console.error(`Error fetching product with ID ${productId}:`, error);
        return of({ details: null, productUrl });
      })
    );
  }

}




