import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product-service/product.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-product-update-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-update-form.component.html',
  styleUrls: ['./product-update-form.component.css']
})
export class ProductUpdateFormComponent implements OnInit {
  @Input() product!: Product;
  @Output() saveChanges = new EventEmitter<Partial<Product>>();

  productForm: FormGroup;
  isEditing = false;
  productId: string | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = '';
  selectedFile: File | null = null;
  oldImageId: string | null = null;
  userRole: string | null = null; 

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private userService: UserService
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      state: ['', Validators.required],
      imageUrl: ['']
    });
  }

  ngOnInit() {

    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId) {
      this.userService.getCredential(currentUserId).subscribe((role) => {
        this.userRole = role;
        console.log('User role:', this.userRole);
      });
    }

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.productId = params.get('id');
          return this.productId ? this.productService.getProductById(this.productId) : of(null);
        }),
        switchMap((product) => {
          if (product) {
            this.product = product;
            this.productForm.patchValue(product);

            if (product.imageUrl.startsWith('data:image')) {
              this.imagePreviewUrl = product.imageUrl; // Directly use base64 image
            } else {
              const imageId = product.imageUrl.split('/').pop();
              this.oldImageId = imageId || null;


              if (imageId) {
                return this.productService.getImage(imageId).pipe(
                  map((imageData) => {
                    this.imagePreviewUrl = imageData.data;
                  })
                );
              }
            }
            return of(null);
          } else {
            console.error('Product not found');
            this.router.navigate(['/']);
            return of(null);
          }
        }),
        catchError((error) => {
          console.error('Error loading product:', error);
          this.router.navigate(['/']);
          return of(null);
        })
      )
      .subscribe();
  }



  onEdit() {
    this.isEditing = true;

    if (this.userRole === 'employee') {
      // Disable all fields except stock for employee users
      this.productForm.get('name')?.disable();
      this.productForm.get('description')?.disable();
      this.productForm.get('price')?.disable();
      this.productForm.get('category')?.disable();
      this.productForm.get('state')?.disable();
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('imagen') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }


  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
        this.selectedFile = file;
      };
      reader.readAsDataURL(file);
    }
  }

  onSave() {
    if (this.productForm.valid && this.productId) {
      if (this.selectedFile) {

        this.productService.uploadImage(this.selectedFile).subscribe({
          next: (newImageUrl) => {
            this.productForm.patchValue({ imageUrl: newImageUrl });
            this.deleteOldImage();
            this.updateProduct();
          },
          error: (error) => {
            console.error('Error uploading new image:', error);
          }
        });
      } else {
        this.updateProduct();
      }
    }
  }


  private deleteOldImage() {
    if (this.oldImageId) {
      this.productService.deleteImage(this.oldImageId).subscribe({
        next: () => {
          console.log('Old image deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting old image:', error);
        }
      });
    }
  }


  private updateProduct() {
    const updatedProduct: Product = {
      id: this.productId!,
      ...this.productForm.value
    };

    this.productService.updateProduct(updatedProduct).subscribe({
      next: (result) => {
        if (result) {
          this.saveChanges.emit(updatedProduct);
          this.isEditing = false;
          console.log('Product updated successfully:', result);
        } else {
          console.error('Product update returned null');
        }
      },
      error: (error) => {
        console.error('Error updating product:', error);
      }
    });
  }


  onCancel() {
    this.isEditing = false;
    this.selectedFile = null;
    this.ngOnInit(); //
  }


  deleteProduct() {
    if (this.userRole === 'employee') {
      console.warn('Employees are not allowed to delete products.');
      return;
    }
  
    const confirmed = window.confirm("¿Estas seguro de eliminar este producto?");
    if (confirmed && this.product) {
      this.productService.deleteProduct(this.product).subscribe({
        next: () => {
          console.log('Producto eliminado');
          this.router.navigate(['/productAdmin']);
        },
        error: (error) => console.error('Error eliminando producto:', error)
      });
    }
  }


}


