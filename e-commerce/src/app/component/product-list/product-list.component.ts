import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service/product.service'; // Adjust the path
import { Product } from '../../models/product'; // Adjust the path
import { CommonModule } from '@angular/common';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().pipe(
      switchMap((data) => {
        this.products = data;
        const imageRequests = this.products.map(product => {
          const imageId = product.imageUrl.split('/').pop();
          if (imageId) {
            return this.productService.getImage(imageId).pipe(
              map(imageData => {
                if (imageData && imageData.data) {
                  product.imageUrl = imageData.data; // Actualiza la URL de la imagen
                }
                return product; // Devuelve el producto modificado
              }),
              catchError(error => {
                console.error('Error loading image data:', error);
                return of(product); // Devuelve el producto original en caso de error
              })
            );
          }
          return of(product); // Si no hay ID, devuelve el producto original
        });
  
        return forkJoin(imageRequests); // Ejecuta todas las solicitudes de imágenes en paralelo
      })
    ).subscribe({
      next: (productsWithImages) => {
        this.products = productsWithImages; // Actualiza la lista de productos con las imágenes
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }
  
  
  
}
