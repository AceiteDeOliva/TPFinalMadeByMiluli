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
ngrok http 4200 > 
Va a saltar un terminal por fuera de la IDE en la que figura una URL>
copiar url y pegarla en server.js linea 14 despues de "const baseUrl =" 
# Esto es necesario por cambios en como funciona la API de Mercado Pago, ya no funciona con localhost

despues en otra terminal desde root >
cd backend >
node server.js


PARA QUE EL PAGO DE PRUEBA SEA APROBADO HAY QUE INICIAR SESION CON LAS CREDENCIALES DE PRUEBA DE MERCADOPAGO Y USAR UNA TARJETA DE PRUEBA DE MERCADOPAGO
