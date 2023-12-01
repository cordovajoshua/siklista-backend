const express = require('express');
const router = express.Router();

// Import Auth
const {verify, verifyAdmin} = require('../auth');
// Import userController
const productController = require('../controllers/product');

// Create New Product
router.post('/', verify, verifyAdmin, productController.createProduct);

// Get Active Products
router.get('/', productController.getActiveProducts);

// Get All Products 
router.get('/all', verify, verifyAdmin, productController.getAllProducts);

// Get a specific product by id
router.get('/:productId', productController.getProduct);

// Update a specific product
router.put('/:productId', verify, verifyAdmin, productController.updateProduct);

// Archive a specific product
router.put('/:productId/archive', verify, verifyAdmin, productController.archiveProduct);

// Activate a specific product
router.put('/:productId/activate', verify, verifyAdmin, productController.activateProduct);





module.exports = router;

