import { Component } from '@angular/core';
import { PurchaseHistoryComponent } from "../../component/purchase-history-list/purchase-history-list.component";

@Component({
  selector: 'app-purchase-history-page',
  standalone: true,
  imports: [PurchaseHistoryComponent],
  templateUrl: './purchase-history-page.component.html',
  styleUrl: './purchase-history-page.component.css'
})
export class PurchaseHistoryPageComponent {

}
