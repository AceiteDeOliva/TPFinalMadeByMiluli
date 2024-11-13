const express = require("express");
const mercadopago = require("mercadopago");
const app = express();

// Set your MercadoPago access token
mercadopago.configurations.setAccessToken("APP_USR-5935796716183020-111213-2eaa73401457692c082d2d7c23235f19-2093892988");

app.use(express.json());

// Endpoint to create preference
app.post("/create_preference", (req, res) => {
  const preference = {
    items: [
      {
        title: req.body.title,
        unit_price: req.body.price,
        quantity: req.body.quantity,
      },
    ],
    back_urls: {
      success: "http://localhost:8080/feedback",
      failure: "http://localhost:8080/feedback",
      pending: "http://localhost:8080/feedback",
    },
    auto_return: "approved",
  };

  mercadopago.preferences.create(preference)
    .then(response => {
      res.json({ id: response.body.id, init_point: response.body.init_point });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error creating preference');
    });
});

// Feedback route
app.get('/feedback', (req, res) => {
  const paymentId = req.query.payment_id;
  const status = req.query.status;
  const merchantOrderId = req.query.merchant_order_id;
  
  res.json({ paymentId, status, merchantOrderId });
});

// Start the server
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
