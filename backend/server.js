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
        failure: 'http://localhost:4200/payment-success',
        pending: 'http://localhost:4200/payment-success',
      },
      auto_return: 'approved',
      notification_url: "https://8473-190-190-36-138.ngrok-free.app/webhook"
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
app.post("/webhook", async (req, res) => {
  const paymentId = req.query.id;

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${client.accessToken}` }
    });

    if (response.ok) {
      const data = await response.json();

      if (data.status === 'approved') {
        console.log("Payment approved:", data);
        
      } else {
        console.log("Payment status:", data.status);
      }
      res.sendStatus(200); // Respond with 200 for all statuses to avoid repeated notifications
    } else {
      console.error("Failed to fetch payment data");
      res.sendStatus(500);
    }

    res.sendStatus(200);

  } catch (error) {
    console.error('Error in webhook:', error);
    res.sendStatus(500);
  }
});

// Payment status endpoint for client-side checks
app.get("/payment-status/:paymentId", async (req, res) => {
  const paymentId = req.params.paymentId;

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${client.accessToken}` }
    });

    if (response.ok) {
      const data = await response.json();
      res.json({ status: data.status, paymentData: data });
    } else {
      console.error('Error fetching payment details:', response.statusText);
      res.status(500).json({ error: "Error fetching payment details" });
    }
  } catch (error) {
    console.error('Error processing payment-status:', error);
    res.status(500).json({ error: "Server error in payment-status" });
  }
});

// Start the server
app.listen(port, () => {
  console.log("Server running on port 8080");
});
