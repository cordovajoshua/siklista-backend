const User = require("../models/User");
const Order = require("../models/Order");
const bcrypt = require("bcrypt");
const auth = require("../auth");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

module.exports.checkEmailExists = (req, res) => {
  return User.find({ email: req.body.email })
    .then((result) => {
      if (result.length > 0) {
        return res.send(true);
      } else {
        return res.send(false);
      }
    })
    .catch((err) => res.send(err));
};

module.exports.registerUser = async (req, res) => {
    const {firstName, lastName, mobileNo, email, password, confirmPassword} = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ message: "Email is already registered." });
    }

    if (password !== confirmPassword) {
      return res.status(200).json({ message: "Password do not match." });
    }

    const newUser = new User({
      email,
      password: bcrypt.hashSync(password, 10),
      firstName,
      lastName,
      mobileNo
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [SECTION] User Login/Authentication
module.exports.loginUser = (req, res) => {
  return User.findOne({ email: req.body.email })
    .then((result) => {
      if (result == null) {
        return res.send(false);
      } else {
        const isPasswordCorrect = bcrypt.compareSync(
          req.body.password,
          result.password
        );

        if (isPasswordCorrect) {
          return res.send({ access: auth.createAccessToken(result) });
        } else {
          return res.send(false);
        }
      }
    })
    .catch((err) => res.send(err));
};

module.exports.getProfile = (req, res) => {
  return User.findById(req.user.id)
    .then((result) => {
      result.password = "";

      return res.send(result);
    })
    .catch((err) => res.send(err));
};

module.exports.updateAdmin = async (req, res) => {
  const adminUserId = req.user.id;
  const userIdToPromote = req.params.userId;

  try {
    // Find the user to promote by ID
    const userToPromote = await User.findById(userIdToPromote);

    if (!userToPromote) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's role to admin
    userToPromote.isAdmin = true;
    await userToPromote.save();

    res.status(200).json({ message: "User updated as an admin successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while promoting the user to admin" });
  }
};

module.exports.getMyOrders = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      return res.json({ message: "Please use a non-admin account" });
    }
    let userId = req.user.id;
    let orders = await Order.find({ userId }).populate('products.product');
    res.send(orders);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" + error.message });
  }
};

module.exports.getAllOrders = async (req, res) => {
  try {
    let orders = await Order.find({}).populate('products.product');;
    res.send(orders);
  } catch (error) {
    console.log(error);
  }
};

module.exports.checkout = async (req, res) => {
  const userId = req.user.id;

  try {
    if (req.user.isAdmin) {
      return res.send("Action forbidden");
    }

    const cart = await Cart.findOne({userId});

    if (!cart || cart.products.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      const order = new Order({
        userId,
        products: cart.products.map(item => ({
          product: item.product,
          quantity: item.quantity
        })),
        totalAmount: cart.totalPrice,
      });
  
      // Save the order to the database
      await order.save();
  
      // Empty the user's cart after successful checkout
      await Cart.findOneAndDelete({ userId });
  
      res.json({ success: true, message: 'Order placed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  module.exports.resetPassword = async (req, res) => {
    const { newPassword } = req.body;

  
    try {
      // Check if the email exists in the database
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password in the database
      await User.findByIdAndUpdate(user._id, { password: hashedPassword });
  
      res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };