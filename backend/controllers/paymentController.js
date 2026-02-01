// backend/controllers/paymentController.js
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// 1. Create Checkout Session
exports.createCheckoutSession = catchAsyncErrors(async (req, res, next) => {
  const { cartItems, user, shippingInfo, subtotal, shippingCharges, tax } =
    req.body;

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  const line_items = cartItems.map((item) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.name,
        metadata: { id: item.product },
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  if (shippingCharges && shippingCharges > 0) {
    line_items.push({
      price_data: {
        currency: "eur",
        product_data: { name: "Shipping Charges" },
        unit_amount: Math.round(shippingCharges * 100),
      },
      quantity: 1,
    });
  }

  if (tax && tax > 0) {
    line_items.push({
      price_data: {
        currency: "eur",
        product_data: { name: "Tax (18%)" },
        unit_amount: Math.round(tax * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "ideal", "bancontact", "sofort", "sepa_debit"],
    line_items,
    mode: "payment",

    // ⭐ Stripe redirect URLs
    success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}/order/confirm`,

    customer_email: user.email,
  });

  res.status(200).json({ success: true, url: session.url });
});

// 2. Payment Verification
exports.paymentVerification = catchAsyncErrors(async (req, res, next) => {
  const { session_id } = req.body;
  const session = await stripe.checkout.sessions.retrieve(session_id);

  res.status(200).json({
    success: true,
    payment_status: session.payment_status,
    payment_id: session.payment_intent,
  });
});

// 3. Send API Key (if needed on frontend)
exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
