// backend/routes/paymentRoute.js
const express = require("express");
const {
  createCheckoutSession,
  sendStripeApiKey,
  paymentVerification,
} = require("../controllers/paymentController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router
  .route("/payment/create-checkout-session")
  .post(isAuthenticatedUser, createCheckoutSession);

router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

router
  .route("/payment/verification")
  .post(isAuthenticatedUser, paymentVerification);

module.exports = router;
