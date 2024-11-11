import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-active-products',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter-active-products.component.html',
  styleUrls: ['./filter-active-products.component.css']
})
export class FilterActiveProductsComponent {
  searchTerm: string = '';
  @Output() searchTermChange = new EventEmitter<string>();

  onSearchChange(): void {
    this.searchTermChange.emit(this.searchTerm);
  }
}
