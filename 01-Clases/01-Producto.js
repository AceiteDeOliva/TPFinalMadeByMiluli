class Producto {
   #idProducto;
   #nombre;
   #precio;
   #stock;

   Producto(nombre, precio, stock) {

      this.#idProducto; //To do: funcion de generar id
      this.#nombre = nombre;
      this.#precio = precio;
      this.#stock = stock || 0;

   };

   get idProducto() {
      return this.#idProducto;
   };

   get Nombre() {
      return this.#nombre;
   }

   get Precio() {
      return this.#precio;
   }

   get Stock() {
      return this.#stock;
   }

   set nombre(nuevoNombre) {
      this.#nombre = nuevoNombre;
   }

   set precio(nuevoPrecio) {
      if (nuevoPrecio > 0) {
         this.#precio = nuevoPrecio;
      } else {
         console.error('El precio debe ser mayor que 0');
      }
   }

   set stock(nuevoStock) {
      if (nuevoStock >= 0) {
         this.#stock = nuevoStock;
      } else {
         console.error('El stock no puede ser negativo');
      }
   }

   display() {
      return `${this.#nombre} (ID: ${this.#idProducto}) - Precio: $${this.#precio}, Stock: ${this.#stock}`;
  }

}