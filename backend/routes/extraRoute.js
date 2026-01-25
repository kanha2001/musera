const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// Controllers Import
const {
  createCoupon,
  applyCoupon,
  getAllCoupons,
  deleteCoupon,
} = require("../controllers/couponController");

// --- 1. Import Wishlist Controller ---
const {
  toggleWishlist,
  getWishlist,
} = require("../controllers/wishlistController");

const { getSearchSuggestions } = require("../controllers/productController");

// --- COUPON ROUTES ---
router
  .route("/coupon/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createCoupon);
router.route("/coupon/apply").post(isAuthenticatedUser, applyCoupon);
router
  .route("/admin/coupons")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllCoupons);
router
  .route("/admin/coupon/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCoupon);

// --- 2. ADD WISHLIST ROUTE HERE ---
router
  .route("/wishlist")
  .post(isAuthenticatedUser, toggleWishlist) // Add/Remove ke liye POST
  .get(isAuthenticatedUser, getWishlist); // Dekhne ke liye GET

// --- SEARCH SUGGESTION ROUTE ---
router.route("/products/search").get(getSearchSuggestions);

module.exports = router;
