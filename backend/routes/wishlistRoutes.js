const express = require("express");
const router = express.Router();
const { getWishlist, toggleWishlist, removeFromWishlist } = require("../controllers/wishlistController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, getWishlist);
router.post("/toggle", verifyToken, toggleWishlist);
router.delete("/:id", verifyToken, removeFromWishlist);

module.exports = router;
