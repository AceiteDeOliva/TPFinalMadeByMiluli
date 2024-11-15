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
        success: 'http://localhost:4200/payment-success',
        failure: 'http://localhost:4200/home',
        pending: 'http://localhost:4200/home',
      },
      auto_return: 'approved',
      notification_url: "https://8f60-190-190-36-138.ngrok-free.app/webhook"
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


// Start the server
app.listen(port, () => {
  console.log("Server running on port 8080");
});
