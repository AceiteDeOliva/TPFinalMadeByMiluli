import { ChangeDetectorRef, Component } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product-service/product.service';
import { Router } from 'express';
import { FavoritesService } from '../../services/favorites-service/favorites.service';
import { ProductListActiveComponent } from '../../component/product-list-active/product-list-active.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [ProductListActiveComponent,CommonModule],
  templateUrl: './favorites-list.component.html',
  styleUrl: './favorites-list.component.css'
})
export class FavoritesListComponent {
    hasFavorites: boolean = false;



}
