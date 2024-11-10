export interface User {
    id:string;
    name: string;
    surname: string;
    email: string;
    password: string;
    cart: Array<{ productUrl: string; quantity: number }>;
    purchaseHistory: Array<{ productId: string; quantity: number; date: Date }>;
    credential: 'user' | 'employee'|'manager'|'admin';
}