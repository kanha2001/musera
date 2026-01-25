const Coupon = require("../models/couponModel");

// 1. Create Coupon (Admin)
exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Validate & Apply Coupon (User)
exports.applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    // Basic Checks
    if (!coupon)
      return res.status(404).json({ message: "Invalid Coupon Code" });
    if (!coupon.isActive)
      return res.status(400).json({ message: "Coupon is Inactive" });
    if (new Date() > coupon.expiryDate)
      return res.status(400).json({ message: "Coupon Expired" });
    if (cartTotal < coupon.minOrderValue) {
      return res.status(400).json({
        message: `Min order value should be €${coupon.minOrderValue}`,
      });
    }

    let discountAmount = 0;

    // Calculation Logic
    if (coupon.type === "flat") {
      discountAmount = coupon.value;
    } else if (coupon.type === "percentage") {
      discountAmount = (cartTotal * coupon.value) / 100;

      // Max Cap Check (e.g. 50% Upto 100)
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    }

    // Discount total se zyada na ho jaye
    if (discountAmount > cartTotal) discountAmount = cartTotal;

    const finalTotal = cartTotal - discountAmount;

    res.status(200).json({
      success: true,
      discountAmount,
      finalTotal,
      message: `Coupon Applied! You saved €${discountAmount}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get All Coupons (Admin)
exports.getAllCoupons = async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({ success: true, coupons });
};

// 4. Delete Coupon (Admin)
exports.deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(404).json({ message: "Not Found" });
  await coupon.deleteOne();
  res.status(200).json({ success: true });
};
