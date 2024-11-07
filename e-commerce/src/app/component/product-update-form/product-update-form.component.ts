import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product-service/product.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-product-update-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-update-form.component.html',
  styleUrls: ['./product-update-form.component.css']
})
export class ProductUpdateFormComponent implements OnInit {
  @Output() saveChanges = new EventEmitter<Partial<Product>>();

  productForm: FormGroup;
  isEditing = false;
  productId: string | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = ''; // Holds the preview URL for current or new image
  selectedFile: File | null = null; // Holds selected file for upload
  oldImageId: string | null = null; // Track the old image ID

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      state: ['', Validators.required],
      imageUrl: [''] // Add imageUrl to form for handling updates
    });
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.productId = params.get('id');
          return this.productId ? this.productService.getProductById(this.productId) : of(null);
        }),
        switchMap((product) => {
          if (product) {
            this.productForm.patchValue(product);
            // If the imageUrl is a full base64 string, set it directly; otherwise, fetch the base64 image data
            if (product.imageUrl.startsWith('data:image')) {
              this.imagePreviewUrl = product.imageUrl;
            } else {
              const imageId = product.imageUrl.split('/').pop();
              this.oldImageId = imageId || null; // Store old image ID for deletion
              if (imageId) {
                return this.productService.getImage(imageId).pipe(
                  map((imageData) => {
                    this.imagePreviewUrl = imageData.data; // Set preview to base64 data from server
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
          return of(null);
        })
      )
      .subscribe();
  }

  // Enables edit mode
  onEdit() {
    this.isEditing = true;
  }

  // Handles file selection and sets image preview without uploading
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result; // Display the image preview
        this.selectedFile = file; // Store selected file for upload on save
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  }

  // Saves the updated product data
  onSave() {
    if (this.productForm.valid && this.productId) {
      if (this.selectedFile) {
        // If a new image is selected, upload it
        this.productService.uploadImage(this.selectedFile).subscribe({
          next: (newImageUrl) => {
            this.productForm.patchValue({ imageUrl: newImageUrl });
            this.deleteOldImage(); // Call to delete old image
            this.updateProduct(); // Save product with new image URL
          },
          error: (error) => {
            console.error('Error uploading new image:', error);
          }
        });
      } else {
        this.updateProduct(); // Proceed with saving without uploading a new image
      }
    }
  }

  // Delete old image if a new one was uploaded
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

  // Separate function to handle product updates
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

  // Cancels editing and reverts form to initial state
  onCancel() {
    this.isEditing = false;
    this.selectedFile = null; // Reset selected file
    this.ngOnInit(); // Reinitialize to reset changes
  }
}
