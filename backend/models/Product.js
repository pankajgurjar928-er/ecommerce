const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    discount: {
      type: Number,
      default: 0
    },

    category: {
      type: String,
      required: true
    },

    image: {
      type: String
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.virtual("finalPrice").get(function() {
  if (this.discount > 0) {
    return Math.round(this.price - (this.price * this.discount) / 100);
  }
  return this.price;
});

module.exports = mongoose.model("Product", productSchema);