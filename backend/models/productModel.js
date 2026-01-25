const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter Product Description"],
  },
  sizeFit: {
    type: String,
    default: "",
  },
  shippingReturns: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: [true, "Please Enter Product Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  discountPrice: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  ageGroups: [
    {
      type: String,
      enum: ["0-3m", "3-6m", "6-9m", "9-12m", "12-16m", "16-24m"],
    },
  ],
  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  category: {
    type: [String],
    required: [true, "Please Enter Product Category"],
  },
  subCategory: {
    type: String,
  },

  // 🔥 NEW SIZE-STOCK MAPPING (PERFECT SOLUTION)
  sizes: [
    {
      size: {
        type: String, // "S", "M", "L", "XL"
        required: true,
      },
      stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
    },
  ],

  colors: [
    {
      type: String,
    },
  ],
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
