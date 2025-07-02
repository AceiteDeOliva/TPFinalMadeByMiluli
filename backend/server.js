import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Set up MercadoPago client
const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-5935796716183020-111213-2eaa73401457692c082d2d7c23235f19-2093892988',
});

const app = express();
const port = 8080;
const processedPayments = new Set();
const baseUrl = "https://e478-190-190-36-138.ngrok-free.app" //se tiene que actualizar cada vez

app.use(cors());
app.use(express.json());

// Endpoint to create preference
app.post("/create_preference", async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: parseFloat(req.body.price),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: `${baseUrl}/payment-status?status=success`,
        failure: `${baseUrl}/payment-status?status=failure`,
        pending: `${baseUrl}/payment-status?status=pending`,
      },
      auto_return: "approved",
      //notification_url: `${baseUrl}/webhook`
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });
    res.json({ id: result.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating preference" });
  }
});


// Webhook to handle MercadoPago notifications
const paymentStatusStore = new Map(); // In-memory store for payment statuses

app.post("/webhook", async (req, res) => {
  const paymentId = req.query['data.id'];

  if (!paymentId) {
    console.error("No payment ID found in the notification.");
    return res.sendStatus(400);
  }

  if (processedPayments.has(paymentId)) {
    console.log("Duplicate payment notification, ignoring:", paymentId);
    return res.sendStatus(200);
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${client.accessToken}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error in webhook handler:", error);
    return res.sendStatus(500);
  }
});

// calculo de envio
const FIXED_PC_ORIGIN = '7600';
const FIXED_PROVINCE_ORIGIN = 'AR-B';
const FIXED_PESO = '2';

app.post("/calculate_shipping_price", async (req, res) => {
  const url = 'https://correo-argentino1.p.rapidapi.com/calcularPrecio';

  const { cpDestino, provinciaDestino } = req.body;

  // Validación básica de los parámetros (ahora no necesitamos cpOrigen ni provinciaOrigen)
  if (!cpDestino || !provinciaDestino) {
    return res.status(400).json({ error: "Faltan parámetros requeridos para el cálculo de envío (cpDestino, provinciaDestino)." });
  }

  try {
    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': 'e541547180mshff1a31f17fb9787p1ec2a4jsne9709e623fea',
        'x-rapidapi-host': 'correo-argentino1.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
      // Usamos el objeto directamente como `body`.
      body: JSON.stringify({
        cpOrigen: FIXED_PC_ORIGIN, // Usamos el valor fijo
        cpDestino,
        provinciaOrigen: FIXED_PROVINCE_ORIGIN, // Usamos el valor fijo
        provinciaDestino,
        peso: FIXED_PESO
      })
    };

    const response = await fetch(url, options);

    // Manejo de errores HTTP: si la respuesta no es 2xx
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error de la API de Correo Argentino: ${response.status} - ${errorText}`);
      return res.status(response.status).json({ error: "Error al llamar a la API de Correo Argentino", details: errorText });
    }

    const result = await response.json();
    res.json(result); // Envía la respuesta de la API externa de vuelta al frontend

  } catch (error) {
    console.error("Error en el endpoint /calculate_shipping_price:", error);
    res.status(500).json({ error: "Error interno del servidor al calcular el envío." });
  }
});


// Start the server
app.listen(port, () => {
  console.log("Server running on port 8080");
});
