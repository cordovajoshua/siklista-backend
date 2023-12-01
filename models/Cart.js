const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User Id is required']
    },
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: [true, 'Quantity is required']
            },
            subtotal: {
                type: Number,
            }
        }
    ],
    totalPrice: {
        type: Number,
    }
    
});

module.exports = mongoose.model('Cart', cartSchema);
