const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Please enter coupon code"],
    unique: true,
    uppercase: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["percentage", "flat"], // Do tarah ke coupon
    required: true,
  },
  value: {
    type: Number,
    required: true, // Percentage amount (e.g. 50) ya Flat amount (e.g. 100)
  },
  maxDiscount: {
    type: Number, // Sirf percentage coupons ke liye (e.g. Upto €100)
    default: null,
  },
  minOrderValue: {
    type: Number, // Kam se kam kitne ka order hona chahiye
    default: 0,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Coupon", couponSchema);
