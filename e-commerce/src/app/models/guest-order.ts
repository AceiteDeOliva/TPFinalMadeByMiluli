import { CartItem } from "./cartItem";

export interface GuestOrder {
    guestId: string; 
    date: Date;
    products: CartItem[];
    recipientName: string;
    recipientSurname: string;
    email: string;
    street: string;
    provinciaDestino: string;
    cpDestino: string;
    shippingMethod: string;
    shippingCost: number;
    totalCost: number;

}
