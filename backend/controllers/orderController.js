const Order = require("../models/Order");

// ================= CREATE ORDER =================
exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      userId: req.user.id,
      products: req.body.products,
      totalAmount: req.body.totalAmount,
      address: req.body.address
    });

    // Clear user cart after checkout
    const Cart = require("../models/Cart");
    await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [] });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET USER ORDERS =================
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("products.productId", "name image price finalPrice")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET ALL ORDERS (ADMIN) =================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId", "name image price finalPrice")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= UPDATE ORDER STATUS (ADMIN) =================
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const currentStatus = order.status;
    const newStatus = req.body.status;

    // Admin can update: Pending <-> Shipped
    const isPendingToShipped = currentStatus === "pending" && newStatus === "shipped";
    const isShippedToPending = currentStatus === "shipped" && newStatus === "pending";

    if (!isPendingToShipped && !isShippedToPending) {
      return res.status(400).json({ message: "Action not allowed" });
    }

    order.status = newStatus;
    await order.save();

    res.json({ message: `Order updated to ${newStatus}`, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= COMPLETE ORDER (USER) =================
exports.completeOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // User can only complete if status is "Shipped"
    if (order.status !== "shipped") {
      return res.status(400).json({ message: "Action not allowed" });
    }

    order.status = "completed";
    await order.save();

    res.json({ message: "Order Completed", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= CANCEL ORDER (USER) =================
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // User can only cancel if status is "Shipped"
    if (order.status !== "shipped") {
      return res.status(400).json({ message: "Action not allowed" });
    }

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order Cancelled", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};