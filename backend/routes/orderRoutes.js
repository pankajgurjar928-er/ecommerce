const express = require("express");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  completeOrder,
  cancelOrder
} = require("../controllers/orderController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// User: place order
router.post("/", verifyToken, createOrder);

// User: get own orders (populated)
router.get("/my", verifyToken, getMyOrders);

// User: complete a delivered order
router.patch("/:id/complete", verifyToken, completeOrder);

// User: cancel a pending/shipped order
router.patch("/:id/cancel", verifyToken, cancelOrder);

// Admin: get all orders
router.get("/", verifyToken, isAdmin, getAllOrders);

// Admin: update status (pending → shipped → delivered)
router.put("/:id", verifyToken, isAdmin, updateOrderStatus);

module.exports = router;