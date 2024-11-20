import { Product } from "./product";

export interface ProductWithOrder extends Product{
  orderId: string;
  quantity: number;
}
