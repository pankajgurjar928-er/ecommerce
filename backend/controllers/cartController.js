const Cart = require("../models/Cart");

// 🛒 ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1 }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId && item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
    }

    await cart.save();

    res.json({ message: "Added to cart", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📦 GET CART
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔄 UPDATE QUANTITY
exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.productId._id.toString() === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        cart.items = cart.items.filter((i) => i.productId._id.toString() !== productId);
      }
      await cart.save();
      // repopulate to return full cart
      const updatedCart = await Cart.findById(cart._id).populate("items.productId");
      res.json(updatedCart);
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ REMOVE ITEM
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id).populate("items.productId");
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= ADMIN: GET ALL CARTS =================
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate("userId", "name email").populate("items.productId", "name price finalPrice");
    res.json(carts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};