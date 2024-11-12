const express = require('express');
const mercadopago = require('mercadopago');
const cors = require('cors');

// Configuración del Access Token
mercadopago.configure({
  access_token: 'YOUR_ACCESS_TOKEN', // Reemplaza con tu Access Token de Mercado Pago
});

const app = express();
app.use(express.json());
app.use(cors()); // Permite que Angular acceda al servidor

// Ruta para crear el Payment Preference
app.post('/create_preference', async (req, res) => {
  const preference = {
    items: [
      {
        title: req.body.title,
        quantity: req.body.quantity,
        currency_id: 'ARS',
        unit_price: req.body.unit_price,
      }
    ],
    back_urls: {
      success: 'https://www.tu-sitio.com/success',
      failure: 'https://www.tu-sitio.com/failure',
      pending: 'https://www.tu-sitio.com/pending'
    },
    auto_return: 'approved',
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Iniciar el servidor
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
