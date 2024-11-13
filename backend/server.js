import express from 'express';
import pkg from 'mercadopago';
import cors from 'cors';  

const { MercadoPagoConfig, Preference } = pkg;

const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'OPTIONS'],  // Allow only necessary methods
  allowedHeaders: ['Content-Type'],  // Specify allowed headers if needed
}));
app.options('*', cors());  // Handle all OPTIONS requests with CORS
app.use(express.json());


// Handle favicon.ico requests to avoid 404 errors
app.get('/favicon.ico', (req, res) => res.status(204));

// Set up MercadoPago client
const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-5935796716183020-111213-2eaa73401457692c082d2d7c23235f19-2093892988'
});
const preference = new Preference(client);

// Root route
app.get('/', (req, res) => {
  res.send("Welcome to the MercadoPago Integration API!");
});

// Endpoint to create preference
app.post("/create_preference", async (req, res) => {
  const body = {
    items: [
      {
        id: '1234',
        title: req.body.title || 'Dummy Title',
        description: req.body.description || 'Dummy description',
        picture_url: req.body.picture_url || 'https://www.myapp.com/myimage.jpg',
        category_id: req.body.category_id || 'car_electronics',
        quantity: req.body.quantity || 1,
        currency_id: req.body.currency_id || 'BRL',
        unit_price: req.body.price || 10,
      },
    ],
    marketplace_fee: 0,
    payer: {
      name: req.body.name || 'Test',
      surname: req.body.surname || 'User',
      email: req.body.email || 'your_test_email@example.com',
      phone: {
        area_code: req.body.phone_area_code || '11',
        number: req.body.phone_number || '4444-4444',
      },
      identification: {
        type: req.body.identification_type || 'CPF',
        number: req.body.identification_number || '19119119100',
      },
      address: {
        zip_code: req.body.zip_code || '06233200',
        street_name: req.body.street_name || 'Street',
        street_number: req.body.street_number || 123,
      },
    },
    back_urls: {
      success: 'https://test.com/success',
      failure: 'https://test.com/failure',
      pending: 'https://test.com/pending',
    },
    differential_pricing: { id: 1 },
    expires: false,
    additional_info: 'Discount: 12.00',
    auto_return: 'all',
    binary_mode: true,
    external_reference: '1643827245',
    marketplace: 'marketplace',
    notification_url: 'https://notificationurl.com',
    operation_type: 'regular_payment',
    payment_methods: {
      default_payment_method_id: 'master',
      excluded_payment_types: [{ id: 'ticket' }],
      excluded_payment_methods: [{ id: '' }],
      installments: 5,
      default_installments: 1,
    },
    shipments: {
      mode: 'custom',
      local_pickup: false,
      default_shipping_method: null,
      free_methods: [{ id: 1 }],
      cost: 10,
      free_shipping: false,
      dimensions: '10x10x20,500',
      receiver_address: {
        zip_code: '06000000',
        street_number: 123,
        street_name: 'Street',
        floor: '12',
        apartment: '120A',
      },
    },
    statement_descriptor: 'Test Store',
  };

  try {
    const response = await preference.create({ body });
    res.json({ id: response.body.id, init_point: response.body.init_point });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating preference');
  }
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
