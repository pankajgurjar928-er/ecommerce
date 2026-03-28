const Wishlist = require("../models/Wishlist");

const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id }).populate("products");
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, products: [] });
    }
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const toggleWishlist = async (req, res) => {
  const { productId } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, products: [productId] });
    } else {
      const index = wishlist.products.indexOf(productId);
      if (index === -1) {
        wishlist.products.push(productId);
      } else {
        wishlist.products.splice(index, 1);
      }
      await wishlist.save();
    }
    const updatedWishlist = await Wishlist.findOne({ userId: req.user.id }).populate("products");
    res.json(updatedWishlist);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(id => id.toString() !== req.params.id);
      await wishlist.save();
    }
    const updatedWishlist = await Wishlist.findOne({ userId: req.user.id }).populate("products");
    res.json(updatedWishlist);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getWishlist, toggleWishlist, removeFromWishlist };
