  require('dotenv').config();
  const express = require('express');
  const app = express();
  const mongoose = require('mongoose');
  const stripePublicKey = require('stripe')(process.env.STRIPE_PUBLIC_KEY);
  const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
  const stripeRoute = require('./routes/stripe.js');
  const authRoute = require('./routes/auth.js');
  const userRoute = require('./routes/users.js');
  const productRoute = require('./routes/products.js');
  const orderRoute = require('./routes/orders.js');
  const cartRoute = require('./routes/carts.js');
  const path = require('path');
  // const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
  const PORT = process.env.PORT || 3000;
  const YOUR_DOMAIN = "http://localhost:3000";
  const { resolve } = require('path');
  const bodyParser = require('body-parser');
  const productsJson = require('./items.json')
  const Product = require('./models/Product');

  mongoose.connect('mongodb://127.0.0.1')
      .then(() => console.log('connected to database'))
      .catch((err) => console.error('connection error', err));

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
      console.log('connected to database 2');
  });



  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));


  //end

  app.use(express.json());
  app.use("/api/auth", authRoute);
  app.use("/api/users", userRoute);
  app.use("/api/products", productRoute);
  app.use("/api/orders", orderRoute);
  app.use("/api/cart", cartRoute);
  app.use(stripeRoute);


  app.post('/', (req, res) => {
      res.sendFile('./public/index.html', { root: __dirname });
  });
  app.get('/api/auth/login', (req, res) => {
      res.sendFile('./public/index.html', { root: __dirname });
  });

  app.get('/success', (req, res) => {
      const path = resolve(process.env.STATIC_DIR + "./public/success.html");
      res.sendFile(path);
  });
  app.get('/publishable-key', (req, res) => {
      res.json({ publishableKey: process.env.STRIPE_PUBLIC_KEY });
  });



  let storeItems = new Map();

  async function initializeStoreItems() {
    try {
      const products = await Product.find({});
      products.forEach(product => {
        storeItems.set(product._id.toString(), {
          priceInCents: product.price * 100,
          name: product.title
        });
      });
    
    } catch (error) {
      console.log(error);
    }
  }

  // Initialize the map when the server starts
  initializeStoreItems();

  // Watch the products collection for changes
  Product.watch().on('change', async (change) => {
    console.log('Product collection change event:', change); // for debugging
    if (change.operationType === 'update' || change.operationType === 'replace') {
      const updatedProduct = await Product.findById(change.documentKey._id);
      storeItems.set(updatedProduct._id.toString(), {
        priceInCents: Math.round(updatedProduct.price * 100),
        name: updatedProduct.title
      });
    }
  });


  app.use(express.static(__dirname));
  app.use(express.static(path.join(__dirname, 'public')));


  app.listen(3000, () => {
      console.log(`server running on ${YOUR_DOMAIN}`);
  });
