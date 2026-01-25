const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apifeatures");
const sendEmail = require("../utils/sendEmail");

// 🔥 HELPER FUNCTION: Update Product Stock
const updateProductStock = async (productId, size, quantity) => {
  const product = await Product.findById(productId);

  if (!product) return false;

  console.log(
    `📦 Updating stock - Product: ${product.name}, Size: ${
      size || "N/A"
    }, Qty: ${quantity}`
  );

  // 🔥 SIZE-SPECIFIC STOCK UPDATE (Main Logic)
  if (product.sizes && product.sizes.length > 0 && size) {
    const sizeIndex = product.sizes.findIndex((s) => s.size === size);

    if (sizeIndex !== -1) {
      // Check if enough stock
      if (product.sizes[sizeIndex].stock < quantity) {
        throw new Error(`Insufficient stock for ${size}`);
      }

      // 🔥 UPDATE SIZE STOCK & TOTAL STOCK
      product.sizes[sizeIndex].stock -= quantity;
      product.stock -= quantity;

      console.log(`✅ Size ${size}: ${product.sizes[sizeIndex].stock}`);
    }
  } else {
    // TOTAL STOCK UPDATE (No sizes)
    if (product.stock < quantity) {
      throw new Error(`Insufficient stock`);
    }
    product.stock -= quantity;
  }

  await product.save();
  return true;
};

// 1. Create New Order - 🔥 STOCK DEDUCTION ADDED!
exports.newOrder = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    console.log("📦 ORDER DATA:", JSON.stringify(req.body, null, 2));

    // 🔥 1. STOCK VALIDATION & UPDATE (CRITICAL!)
    for (let item of orderItems) {
      console.log(
        `🔍 Checking: ${item.name} (${item.size || "N/A"}) x${item.quantity}`
      );

      // Validate stock before creating order
      await updateProductStock(item.product, item.size, item.quantity);
    }

    // 🔥 2. FETCH CORRECT IMAGES FROM DB
    const verifiedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        const productFromDb = await Product.findById(item.product);
        if (!productFromDb) {
          throw new Error(`Product not found: ${item.name}`);
        }

        return {
          product: item.product,
          name: productFromDb.name,
          price: productFromDb.price,
          quantity: item.quantity,
          size: item.size || "Standard", // 🔥 Keep size info
          color: item.color || "Standard",
          image:
            productFromDb.images && productFromDb.images.length > 0
              ? productFromDb.images[0].url
              : "/uploads/default_product.png",
        };
      })
    );

    // 🔥 3. CREATE ORDER
    const order = await Order.create({
      shippingInfo,
      orderItems: verifiedOrderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    // 🔥 4. SEND EMAIL
    const message = `Dear ${req.user.name},\n\nThank you for your order! \nOrder ID: ${order._id} \nTotal Amount: €${order.totalPrice} \n\nWe will notify you once it ships.`;

    try {
      await sendEmail({
        email: req.user.email,
        subject: "Order Confirmation - Musera",
        message,
      });
    } catch (error) {
      console.log("Email could not be sent", error.message);
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("🚨 ORDER ERROR:", error);

    // 🔥 ROLLBACK STOCK on error
    if (req.body.orderItems) {
      for (let item of req.body.orderItems) {
        try {
          await updateProductStock(item.product, item.size, -item.quantity);
        } catch (rollbackError) {
          console.error("Rollback failed:", rollbackError);
        }
      }
    }

    res.status(500).json({ message: error.message });
  }
};

// 2. Get Single Order
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. My Orders (Logged in User)
exports.myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. User Requests Return
exports.requestReturn = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({ message: "Product not delivered yet" });
    }

    order.orderStatus = "Return Requested";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Return Requested Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({ success: true, totalAmount, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Update Order Status (Admin)
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus === "Delivered") {
      return res
        .status(400)
        .json({ message: "You have already delivered this order" });
    }

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 FIXED Helper: Update Stock (Return Stock)
async function updateStock(id, quantity) {
  try {
    const product = await Product.findById(id);
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        // Handle size-specific return (needs size info)
        console.log("Size-specific return needs implementation");
      } else {
        product.stock += quantity; // Return stock
        await product.save({ validateBeforeSave: false });
      }
    }
  } catch (error) {
    console.error("Stock return error:", error);
  }
}

// 7. Delete Order (Admin)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // 🔥 RETURN STOCK ON ORDER DELETE
    for (const item of order.orderItems) {
      await updateStock(item.product, item.quantity);
    }

    await order.deleteOne();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8. Get User Stats (Admin)
exports.getUserOrderStats = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId });

    let totalSpent = 0;
    let returnedCount = 0;
    let cancelledCount = 0;

    orders.forEach((order) => {
      totalSpent += order.totalPrice;
      if (order.orderStatus === "Returned") returnedCount++;
      if (order.orderStatus === "Cancelled") cancelledCount++;
    });

    res.status(200).json({
      success: true,
      totalOrders: orders.length,
      totalSpent,
      returnedCount,
      cancelledCount,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
