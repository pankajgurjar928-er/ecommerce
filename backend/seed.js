const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

const Product = require("./models/Product");
const Cart = require("./models/Cart");
const Order = require("./models/Order");

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const seedProducts = async () => {
  try {
    console.log("Fetching products from FakeStore API...");
    const { data } = await axios.get("https://fakestoreapi.com/products");
    
    // Clear existing collections
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    console.log("Cleared existing DB collections (Products, Carts, Orders).");

    // Map FakeStore products to our schema
    const formattedProducts = data.map((item) => ({
      name: item.title,
      description: item.description,
      price: Math.round(item.price * 80), // Convert to roughly INR
      category: item.category,
      image: item.image,
      stock: Math.floor(Math.random() * 50) + 10,
    }));

    await Product.insertMany(formattedProducts);
    console.log("Successfully seeded database with FakeStore products!");
    
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedProducts();