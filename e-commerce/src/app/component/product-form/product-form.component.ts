import { ProductService } from './../../services/product-service/product.service';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'] // Corrected to 'styleUrls'
})
export class ProductFormComponent {
  productForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private productService: ProductService
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      category: [''],
      stock: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      image: [''],
    });
  }

  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.productForm.patchValue({
          image: reader.result as string
        });
      };

      reader.readAsDataURL(file);
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('imagen') as HTMLInputElement; 
    if (fileInput) {
      fileInput.click(); 
    }
  }

  submitProduct() {
    if (this.productForm.invalid) {
      alert('Please fill in all required fields.');
      return;
    }

    const { name, description, price, category, stock, image } = this.productForm.value;

    this.productService.addProduct(name, description, price, category, stock, image).subscribe(
      response => {
        alert('Product added successfully!');
        this.router.navigate(['/products']); // me lleva al listado de productos
      },
      error => console.error('Error adding product:', error)
    );
  }

}
