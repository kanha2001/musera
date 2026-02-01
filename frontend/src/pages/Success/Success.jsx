import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../features/cartSlice";
import { CheckCircle, XCircle } from "lucide-react";
import "./Success.css";

const Success = () => {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");
  const dispatch = useDispatch();

  // Cart ka data chahiye order banane ke liye
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);

  const [status, setStatus] = useState("processing");
  const runOnce = useRef(false); // Double call rokne ke liye

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const shippingCharges = subtotal > 200 ? 0 : 50;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + shippingCharges + tax;

  useEffect(() => {
    if (!session_id) {
      setStatus("failed");
      return;
    }

    if (runOnce.current) return; // Prevent double execution
    runOnce.current = true;

    const createOrder = async () => {
      try {
        // 1. Payment Verify Karo (Backend se ab payment_id bhi aayegi)
        const { data: paymentData } = await axios.post(
          "/api/v1/payment/verification",
          { session_id }
        );

        if (paymentData.payment_status === "paid") {
          // 2. Order Database mein Save Karo
          const orderData = {
            shippingInfo,
            orderItems: cartItems,
            paymentInfo: {
              // CHANGE: Ab hum Backend se aayi hui 'payment_id' use kar rahe hain (pi_...)
              id: paymentData.payment_id,
              status: "succeeded",
            },
            itemsPrice: subtotal,
            taxPrice: tax,
            shippingPrice: shippingCharges,
            totalPrice: totalPrice,
          };

          const config = { headers: { "Content-Type": "application/json" } };
          await axios.post("/api/v1/order/new", orderData, config);

          // 3. Success UI & Clear Cart
          setStatus("success");
          dispatch(clearCart());
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Order Creation Failed:", error);
        setStatus("failed");
      }
    };

    createOrder();
  }, [
    session_id,
    dispatch,
    cartItems,
    shippingInfo,
    subtotal,
    tax,
    shippingCharges,
    totalPrice,
  ]);

  return (
    <div className="success-page-container">
      {status === "processing" && (
        <h2>Verifying Payment & Creating Order...</h2>
      )}

      {status === "success" && (
        <div className="success-content">
          <CheckCircle size={80} color="#2ecc71" />
          <h1>Order Placed Successfully!</h1>
          {/* <p>Your Payment ID has been saved.</p> */}
          <Link to="/shop" className="success-btn">
            Continue Shopping
          </Link>
        </div>
      )}

      {status === "failed" && (
        <div className="success-content">
          <XCircle size={80} color="#e74c3c" />
          <h1>Payment Verified but Order Failed</h1>
          <p>Contact support if money was deducted.</p>
          <Link to="/order/confirm" className="success-btn">
            Try Again
          </Link>
        </div>
      )}
    </div>
  );
};

export default Success;
