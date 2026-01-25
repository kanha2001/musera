const express = require("express");
const {
  createCheckoutSession, // Naya function import karein
  sendStripeApiKey,
  paymentVerification,
} = require("../controllers/paymentController");

const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();

// Route Update: Pehle processPayment tha, ab createCheckoutSession hai
router
  .route("/payment/create-checkout-session")
  .post(isAuthenticatedUser, createCheckoutSession);

router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

router
  .route("/payment/verification")
  .post(isAuthenticatedUser, paymentVerification);

module.exports = router;
