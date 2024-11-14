import express from 'express';
import cors from 'cors';


import { MercadoPagoConfig, Preference } from 'mercadopago';

// Set up MercadoPago client
const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-5935796716183020-111213-2eaa73401457692c082d2d7c23235f19-2093892988',
});

const app = express();
const port = 8080;


app.use(cors());
app.use(express.json());

// Handle favicon.ico requests
app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/', (req, res) => {
  res.send("Welcome to the MercadoPago Integration API!");
});


// Endpoint to create preference
app.post("/create_preference", async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.price),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: 'https://test.com/success',
        failure: 'https://test.com/failure',
        pending: 'https://test.com/pending',
      },
      auto_return: 'approved',
    };

    const preference = new Preference(client);
    const result = await preference.create({body});
    res.json({
      id: result.id,
    });
  } catch (error){
    console.log(error);
    res.status(500).json({
       error: "Error al crear preferencia",
    });

  }
});

// Start the server
app.listen(port, () => {
  console.log("Server running on port 8080");
});
