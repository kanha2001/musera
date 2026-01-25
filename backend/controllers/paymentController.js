const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// 1. Create Checkout Session
exports.createCheckoutSession = catchAsyncErrors(async (req, res, next) => {
  const { cartItems, user } = req.body;

  // --- URL FIX: Hardcoded for Localhost ---
  const frontendUrl = "http://localhost:5173";

  // Line Items Setup
  const line_items = cartItems.map((item) => {
    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          metadata: { id: item.product },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    };
  });

  // Stripe Session Create
  const session = await stripe.checkout.sessions.create({
    payment_method_types: [
      "card",
      "ideal",
      "bancontact",
      "sofort",
      "sepa_debit",
    ],
    line_items,
    mode: "payment",

    // SUCCESS URL
    success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,

    // CANCEL URL
    cancel_url: `${frontendUrl}/order/confirm`,

    customer_email: user.email,
  });

  res.status(200).json({ success: true, url: session.url });
});

// 2. Payment Verification (UPDATED)
exports.paymentVerification = catchAsyncErrors(async (req, res, next) => {
  const { session_id } = req.body;
  const session = await stripe.checkout.sessions.retrieve(session_id);

  res.status(200).json({
    success: true,
    payment_status: session.payment_status,
    // YEH LINE ADD KI HAI: Asli Payment ID (pi_...) bhej rahe hain
    payment_id: session.payment_intent,
  });
});

// 3. Send API Key
exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
