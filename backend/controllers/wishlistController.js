const Wishlist = require("../models/wishlistModel");
const Product = require("../models/productModel"); // Product Model Import Zaroori Hai

// 1. Toggle Wishlist (Add/Remove)
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId, name, price, image } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    const itemIndex = wishlist.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Remove
      wishlist.products.splice(itemIndex, 1);
      await wishlist.save();

      // Updated List bhejo taaki UI sync rahe
      return res.status(200).json({
        success: true,
        message: "Removed from Wishlist",
        wishlist, // Updated Wishlist Object
      });
    } else {
      // Add
      wishlist.products.push({ product: productId, name, price, image });
      await wishlist.save();

      return res.status(200).json({
        success: true,
        message: "Added to Wishlist",
        wishlist,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get My Wishlist (WITH REAL-TIME STOCK CHECK)
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(200).json({ success: true, wishlist: [] });
    }

    // Har product ka latest stock fetch karo
    // Hum Promise.all use karenge taaki fast ho
    const wishlistWithStock = await Promise.all(
      wishlist.products.map(async (item) => {
        const product = await Product.findById(item.product);
        return {
          product: item.product, // ID
          name: item.name,
          price: item.price,
          image: item.image,
          stock: product ? product.stock : 0, // Agar product delete ho gaya to stock 0
        };
      })
    );

    res.status(200).json({
      success: true,
      wishlist: wishlistWithStock,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
