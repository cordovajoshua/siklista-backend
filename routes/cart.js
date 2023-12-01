const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');

const {verify, verifyAdmin} = require('../auth');

// Get user's shopping cart
router.get('/', verify, cartController.getCart);

// Add a product to the shopping cart
router.post('/', verify, cartController.addToCart);

// Remove a product from the shopping cart
router.post('/remove', verify, cartController.removeFromCart);

module.exports = router;