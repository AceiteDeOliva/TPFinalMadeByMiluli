export interface Product {
  email: string;
  nombre: string;
  direccion: string;
  products: Product [];
  category: string;
  stock: number;
  imageUrl: string;
  state: "active"|"inactive";
}
