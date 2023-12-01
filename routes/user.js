const express = require('express');
const router = express.Router();

// Import Auth
const {verify, verifyAdmin} = require('../auth');
// Import userController
const userController = require('../controllers/user');

// Existing Email Check Route
router.post('/checkEmail', userController.checkEmailExists);

// User Registration Route
router.post('/register', userController.registerUser);

// User Login Route
router.post('/login', userController.loginUser);

// Get Profile
router.get('/userDetails', verify, userController.getProfile);

router.post('/resetpassword', verify, userController.resetPassword);


router.put('/:userId/setAsAdmin', verify, verifyAdmin, userController.updateAdmin);

// Checkout 
router.post('/checkout', verify, userController.checkout);

// View logged in user's orders
router.get('/myOrders', verify, userController.getMyOrders);

// Get all orders (admin)
router.get('/orders', verify, verifyAdmin, userController.getAllOrders);

module.exports = router;

