const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive number"],
    },
    oldPrice: {
      type: Number,
      required: false,
      min: [0, "Price must be a positive number"],
    },
    sizes: {
      type: [String],
      required: true,
      enum: ["S", "M", "L", "XL"],
    },
    imageUrl: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    category: {
      type: [String],
      required: true,
      enum: [
        "Male Adult",
        "Male Children",
        "Female Adult",
        "Female Children",
      ],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
