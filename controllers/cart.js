const Cart = require('../models/Cart');
const Product = require('../models/Product');

module.exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId: userId }).populate('products.product');
    if (cart !== null) {
      res.send(cart);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// module.exports.addToCart = async (req, res) => {
//   const { productId, quantity, userId } = req.body;

//   try {
//     const product = await Product.findById(productId);
//     const subtotal = product.price * quantity;
//     // Update or create the shopping cart
//     const cart = await Cart.findOneAndUpdate(
//       { userId: req.user.id },
//       { 
//         $push: { products: { productId, quantity } } ,
//         $inc: { totalAmount: subtotal }
//     },
      
//       { upsert: true, new: true }
//     );
//     console.log(true);
//     res.send(true);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// module.exports.addToCart = async (req, res) => {
//   const { productId, quantity } = req.body;

//   try {
//     const product = await Product.findById(productId);
//     const subtotal = product.price * quantity;

//     // Check if the product is already in the cart
//     const existingProduct = await Cart.findOne({
//       userId: req.user.id,
//       'products.product': productId,
//     });

//     if (existingProduct) {
//       // If the product is already in the cart, update its quantity
//       await Cart.updateOne(
//         {
//           userId: req.user.id,
//           'products.product': productId,
//         },
//         {
//           $inc: {
//             'products.$.quantity': quantity,
//             subtotal: subtotal,
//           },
//         }
//       );
//     } else {
//       // If the product is not in the cart, add a new entry
//       await Cart.findOneAndUpdate(
//         { userId: req.user.id },
//         {
//           $push: { products: { product, quantity } },
//           $inc: { subtotal: subtotal },
//         },
//         { upsert: true, new: true }
//       );
//     }

//     res.send(true);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

module.exports.addToCart = async (req, res) => {
  const { productId, quantity, userId } = req.body;

  try {
    // Find the product details
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Calculate the subtotal for the product
    const subtotal = product.price * quantity;

    // Check if the user has an existing cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If the user doesn't have a cart, create a new one
      cart = new Cart({
        userId,
        products: [{ product: productId, quantity, subtotal }],
        totalPrice: subtotal,
      });

      await cart.save();
    } else {
      // If the user already has a cart, check if the product is already in the cart
      const existingProduct = cart.products.find(
        (item) => item.product.toString() === productId
      );

      if (existingProduct) {
        // If the product is already in the cart, update its quantity and subtotal
        existingProduct.quantity += quantity;
        existingProduct.subtotal += subtotal;
      } else {
        // If the product is not in the cart, add a new entry
        cart.products.push({ product: productId, quantity, subtotal });
      }

      // Update the total price in the cart
      cart.totalPrice += subtotal;

      // Save the updated cart
      await cart.save();
    }

    res.json({ success: true, message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id; // Assuming you have the user ID in the request, adjust if needed

  try {
    // Find the product details
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found for the user' });
    }

    // Find the index of the product in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in the cart' });
    }

    // Get the quantity and subtotal of the product being removed
    const { quantity, subtotal } = cart.products[productIndex];

    // Update the total price in the cart
    cart.totalPrice -= subtotal;

    // Remove the product from the cart's products array
    cart.products.splice(productIndex, 1);

    // Save the updated cart
    await cart.save();

    res.json({ success: true, message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports.removeFromCart = removeFromCart;
