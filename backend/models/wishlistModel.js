const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    unique: true, // Ek user ki ek hi wishlist list hogi
  },
  products: [
    {
      product: { type: mongoose.Schema.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      image: String,
    },
  ],
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
