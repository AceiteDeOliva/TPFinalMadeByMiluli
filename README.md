# TPLaboIV
Trabajo practico final laboratorio/metodología 
E-commerce para Made by Miluli, venta de tejidos de crochet

Jose Valentin Letamendia Muzio
Milagros Abril Rodriguedez

desde terminal >
cd e-commerce >
ng serve >
abrir otra terminal desde e-commerce >
json-server db.json >
y en otra terminal en e-commerce >
json-server images.json --port 3001


Una vez hecho ng serve >
ngrok http 4200 > //expone la url para que funcione la API de MercadoPago, ya que hubo cambios y no funciona con localhost
Va a saltar un terminal por fuera de la IDE en la que figura una URL>
copiar url y pegarla en server.js linea 14 despues de "const baseUrl ="

despues en otra terminal desde root >
cd backend >
node server.js
