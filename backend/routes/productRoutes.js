const express = require("express");
const {
  addProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct
} = require("../controllers/productController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// ADD PRODUCT (admin only)
router.post("/", verifyToken, isAdmin, addProduct);

// GET PRODUCTS (filter + search)
router.get("/", getProducts);

// GET SINGLE PRODUCT BY ID
router.get("/:id", getProductById);

// UPDATE PRODUCT (admin only)
router.put("/:id", verifyToken, isAdmin, updateProduct);

// DELETE PRODUCT (admin only)
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

module.exports = router;