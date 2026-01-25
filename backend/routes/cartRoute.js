const express = require("express");
const {
  addToCart,
  getCart,
  removeFromCart,
} = require("../controllers/cartController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/cart/add").post(isAuthenticatedUser, addToCart);
router.route("/cart").get(isAuthenticatedUser, getCart);
router.route("/cart/:id").delete(isAuthenticatedUser, removeFromCart);

module.exports = router;
