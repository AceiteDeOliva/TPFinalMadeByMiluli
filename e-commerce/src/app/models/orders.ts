import { CartItem } from './cartItem';

export interface Order {
  orderId: string,
  products: CartItem[];  
  date: Date;
  recipientName: string;
  recipientSurname: string;
  street: string;
  provinciaDestino: string;
  cpDestino: string;
  shippingMethod: 'domicilio' | 'sucursal';
  shippingCost: number,
  totalCost:number,
  state: 'Pendiente' | 'Procesando' | 'Enviado' | 'Entregado' | 'Cancelado' | 'Devuelto' | 'Fallido' | 'Reembolsado';
}
