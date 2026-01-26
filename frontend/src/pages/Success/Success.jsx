// frontend/src/pages/Order/Success.jsx
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

  // Redux
  const { cartItems: reduxCartItems, shippingInfo: reduxShipping } = useSelector(
    (state) => state.cart
  );

  // LocalStorage fallback (important after Stripe redirect)
  const lsCartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  const lsShippingInfo = JSON.parse(
    localStorage.getItem("shippingInfo") || "{}"
  );

  const cartItems = reduxCartItems && reduxCartItems.length > 0
    ? reduxCartItems
    : lsCartItems;

  const shippingInfo =
    reduxShipping && Object.keys(reduxShipping).length > 0
      ? reduxShipping
      : lsShippingInfo;

  const [status, setStatus] = useState("processing");
  const runOnce = useRef(false);

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

    if (runOnce.current) return;
    runOnce.current = true;

    const createOrder = async () => {
      try {
        const { data: paymentData } = await axios.post(
          "/api/v1/payment/verification",
          { session_id }
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
            totalPrice: totalPrice,
          };

          const config = { headers: { "Content-Type": "application/json" } };
          await axios.post("/api/v1/order/new", orderData, config);

          setStatus("success");
          dispatch(clearCart());
          localStorage.removeItem("cartItems");
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
          <Link to="/account/orders" className="success-btn">
            View My Orders
          </Link>
        </div>
      )}

      {status === "failed" && (
        <div className="success-content">
          <XCircle size={80} color="#e74c3c" />
          <h1>Payment Verified but Order Failed</h1>
          <p>Contact support if money was deducted.</p>
          <Link to="/cart" className="success-btn">
            Try Again
          </Link>
        </div>
      )}
    </div>
  );
};

export default Success;
