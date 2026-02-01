// controllers/cartController.js
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// 1. Add to Cart (size + stock check from Product.sizes)
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;

    if (!size) {
      return res.status(400).json({
        success: false,
        message: "Please select size before adding to cart",
      });
    }

    const productDetails = await Product.findById(productId);

    if (!productDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // 🔥 size-wise stock from Product.sizes
    // Product.sizes == [ { size: "S", stock: 10 }, ... ]
    let sizeStock = 0;

    if (Array.isArray(productDetails.sizes) && productDetails.sizes.length > 0) {
      const sizeObj = productDetails.sizes.find((s) => s.size === size);
      sizeStock = sizeObj ? sizeObj.stock : 0;
    }

    if (!sizeStock || sizeStock <= 0) {
      return res.status(400).json({
        success: false,
        message: `Size ${size} is out of stock`,
      });
    }

    const qtyToAdd = Number(quantity) || 1;

    if (qtyToAdd > sizeStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${sizeStock} item(s) available for size ${size}`,
      });
    }

    const secureName = productDetails.name;
    const securePrice = productDetails.price;
    const secureImage =
      productDetails.images && productDetails.images.length > 0
        ? productDetails.images[0].url
        : "/uploads/default_product.png";

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // --- New Cart ---
      cart = await Cart.create({
        user: req.user._id,
        cartItems: [
          {
            product: productId,
            name: secureName,
            price: securePrice,
            image: secureImage,
            size, // ⭐ size save karo
            quantity: qtyToAdd,
          },
        ],
      });
    } else {
      // --- Existing Cart ---
      // same product + same size check karo
      const itemIndex = cart.cartItems.findIndex(
        (p) =>
          p.product.toString() === productId &&
          p.size === size
      );

      if (itemIndex > -1) {
        // already in cart – add quantity but not above stock
        const newQty = cart.cartItems[itemIndex].quantity + qtyToAdd;

        if (newQty > sizeStock) {
          return res.status(400).json({
            success: false,
            message: `Only ${sizeStock} item(s) available for size ${size}`,
          });
        }

        cart.cartItems[itemIndex].quantity = newQty;
        cart.cartItems[itemIndex].price = securePrice; // update price if changed
      } else {
        // new size/product
        cart.cartItems.push({
          product: productId,
          name: secureName,
          price: securePrice,
          image: secureImage,
          size,
          quantity: qtyToAdd,
        });
      }

      await cart.save();
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Cart (same)
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    res.status(200).json({ success: true, cart: cart ? cart.cartItems : [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Remove Item from Cart
// yaha product + size se remove karenge
exports.removeFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const size = req.query.size; // optional

    cart.cartItems = cart.cartItems.filter((item) => {
      if (size) {
        return !(
          item.product.toString() === req.params.id &&
          item.size === size
        );
      }
      return item.product.toString() !== req.params.id;
    });

    await cart.save();

    res.status(200).json({ success: true, cart: cart.cartItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
