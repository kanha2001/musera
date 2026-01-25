const Cart = require("../models/cartModel");
const Product = require("../models/productModel"); // Product Model Import Zaroori Hai

// 1. Add to Cart (SECURE WAY)
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body; // Frontend se sirf ye do cheezein chahiye

    // 1. Database se Product dhundho (Security Check)
    const productDetails = await Product.findById(productId);

    if (!productDetails) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Sahi Data Extract karo
    const secureName = productDetails.name;
    const securePrice = productDetails.price;
    // Pehli image uthao, agar array empty hai to default lagao
    const secureImage =
      productDetails.images && productDetails.images.length > 0
        ? productDetails.images[0].url
        : "/uploads/default_product.png";

    // 3. User ka Cart dhundho
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // --- Case A: Naya Cart banao ---
      cart = await Cart.create({
        user: req.user._id,
        cartItems: [
          {
            product: productId,
            name: secureName, // DB se liya
            price: securePrice, // DB se liya (Safe)
            image: secureImage, // DB se liya
            quantity: quantity,
          },
        ],
      });
    } else {
      // --- Case B: Existing Cart update karo ---

      // Check karo kya ye product pehle se cart me hai?
      const itemIndex = cart.cartItems.findIndex(
        (p) => p.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Agar hai, to Quantity badha do
        cart.cartItems[itemIndex].quantity += quantity;

        // Optional: Price bhi update kar do (agar beech me price change hua ho)
        cart.cartItems[itemIndex].price = securePrice;
      } else {
        // Agar nahi hai, to naya item push karo
        cart.cartItems.push({
          product: productId,
          name: secureName,
          price: securePrice,
          image: secureImage,
          quantity: quantity,
        });
      }

      await cart.save();
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get Cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    // Agar cart nahi hai to empty array bhejo
    res.status(200).json({ success: true, cart: cart ? cart.cartItems : [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Remove Item from Cart
exports.removeFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Filter karke item hata do
    cart.cartItems = cart.cartItems.filter(
      (item) => item.product.toString() !== req.params.id
    );

    await cart.save();

    res.status(200).json({ success: true, cart: cart.cartItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
