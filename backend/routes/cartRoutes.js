const express = require("express");
const router = express.Router();

const { addToCart, getCart, updateQuantity, removeItem, getAllCarts } = require("../controllers/cartController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/cart", verifyToken, addToCart);
router.get("/cart", verifyToken, getCart);
router.put("/cart", verifyToken, updateQuantity);
router.delete("/cart/:productId", verifyToken, removeItem);

// ADMIN ROUTES
router.get("/admin/carts", verifyToken, isAdmin, getAllCarts);

module.exports = router;