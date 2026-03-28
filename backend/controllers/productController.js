const Product = require("../models/Product");

// ================= ADD PRODUCT =================
exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product added successfully",
      product
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET PRODUCTS (FILTER + SEARCH) =================
exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    // category filter
    if (category) {
      filter.category = category;
    }

    // search filter
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter);

    // add finalPrice
    const updatedProducts = products.map((p) => ({
      ...p._doc,
      finalPrice: p.price - (p.price * p.discount / 100)
    }));

    res.json(updatedProducts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET SINGLE PRODUCT =================
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    
    // Attach dynamically calculated finalPrice just like we do for the grid
    const finalPrice = product.price - (product.price * (product.discount || 0) / 100);
    const enhancedProduct = { ...product._doc, finalPrice };

    res.json(enhancedProduct);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).json({ error: err.message });
  }
};

// ================= UPDATE PRODUCT =================
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Product updated successfully",
      product
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE PRODUCT =================
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};