const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes Import
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
// const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');

const port = 4003;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MONGOOSE CONNECTION
connectDB()
  .then(() => console.log('DB connection successful'))
  .catch((err) => console.log(err));

async function connectDB() {
  await mongoose.connect(process.env.DB_URL);
}

// ROUTES
app.use('/b3/users', userRoutes);
app.use('/b3/products', productRoutes);
// app.use('/orders', orderRoutes);
app.use('/b3/cart', cartRoutes);

if (require.main === module) {
  app.listen(process.env.PORT || port, () => {
    console.log(`API is now online on port ${process.env.PORT || port}`);
  });
}

module.exports = { app, mongoose };
