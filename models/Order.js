const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is required']
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
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required']
    },
    purchasedOn: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('Order', orderSchema);
