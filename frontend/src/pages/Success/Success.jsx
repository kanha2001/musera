// src/pages/Success/Success.jsx
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearCart } from "../../features/cartSlice";
import { CheckCircle, XCircle } from "lucide-react";
import "./Success.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL; // .env se

const Success = () => {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");
  const dispatch = useDispatch();

  const [status, setStatus] = useState("processing");
  const runOnce = useRef(false);

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo") || "{}");
  const cartItems = orderInfo.cartItems || [];
  const shippingInfo = orderInfo.shippingInfo || {};

  const subtotal = orderInfo.subtotal || 0;
  const shippingCharges = orderInfo.shippingCharges || 0;
  const tax = orderInfo.tax || 0;
  const totalPrice = orderInfo.totalPrice || 0;

  useEffect(() => {
    if (!session_id) {
      setStatus("failed");
      return;
    }

    if (runOnce.current) return;
    runOnce.current = true;

    const createOrder = async () => {
      try {
        const { data: paymentData } = await axios.post(
          `${backendUrl}/api/v1/payment/verification`,
          { session_id },
          { withCredentials: true }
        );

        if (paymentData.payment_status === "paid") {
          const orderData = {
            shippingInfo,
            orderItems: cartItems,
            paymentInfo: {
              id: paymentData.payment_id,
              status: "succeeded",
            },
            itemsPrice: subtotal,
            taxPrice: tax,
            shippingPrice: shippingCharges,
            totalPrice,
          };

          const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          };

          await axios.post(
            `${backendUrl}/api/v1/order/new`,
            orderData,
            config
          );

          setStatus("success");
          dispatch(clearCart());
          sessionStorage.removeItem("orderInfo");
        } else {
          setStatus("failed");
        }
      } catch (error) {
  console.error("Order Creation Failed:", error.response?.data || error.message);
  setStatus("failed");
}

    };

    createOrder();
  }, [session_id, dispatch]);

  return (
    <div className="success-page-container">
      {status === "processing" && (
        <h2>Verifying Payment & Creating Order...</h2>
      )}

      {status === "success" && (
        <div className="success-content">
          <CheckCircle size={80} color="#2ecc71" />
          <h1>Order Placed Successfully!</h1>
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
