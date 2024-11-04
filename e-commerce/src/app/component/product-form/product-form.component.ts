import { ProductService } from './../../services/product-service/product.service';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'] 
})

export class ProductFormComponent {
  productForm: FormGroup;
  imagePreviewUrl: string | ArrayBuffer | null = null; //Variable to save the image preview

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      category: [''],
      stock: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      image: [null, Validators.required]
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement; //casts the event to an HTML input(for the product image button)
    if (input.files && input.files[0]) { //Checks the file was actually selected and not null
      const file = input.files[0]; //declares the file
      const reader = new FileReader(); //declares the FileReader
      
      reader.onload = () => {
        this.imagePreviewUrl = reader.result; //the image for the preview
      };

      reader.readAsDataURL(file);  //reads the file
      this.productForm.patchValue({ image: file }); //saves the image in the product form 
    }
  }

  triggerFileInput() { //function to trigger on the upload image button
    const fileInput = document.getElementById('imagen') as HTMLInputElement; //casts the image as a HTML input
    if (fileInput) {
      fileInput.click(); //opens the explorer
    }
  }

  submitProduct() {//submits the product to the server
    if (this.productForm.invalid) { //if all fields are full
      alert('Completar todos los campos .');
      return;
    }
  
    const { name, description, price, category, stock, image } = this.productForm.value; //destructures the form to access each field
  
    this.productService.addProduct(name, description, price, category, stock, image).subscribe({//calls the addProduct method from the product service
      next: (response) => {
        alert('Producto agregado correctamente');
      },
      error: (error) => {
        console.error('Error agregando producto:', error);
      }
    });
  }
  
  

}
