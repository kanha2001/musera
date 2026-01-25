import React from "react";
import CheckoutSteps from "../../components/CartModel/CheckoutSteps";
import { useSelector } from "react-redux";
import axios from "axios";
import "./Payment.css";
import { toast } from "react-toastify";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const handleCheckout = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // 1. Backend ko data bhejo
      const { data } = await axios.post(
        "/api/v1/payment/create-checkout-session",
        {
          cartItems,
          shippingInfo,
          user, // Email ke liye
        },
        config
      );

      // 2. Stripe URL par redirect karo
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error(error.response.data.message || "Payment Error");
    }
  };

  return (
    <div className="payment-container">
      <CheckoutSteps activeStep={2} />

      <div className="payment-box">
        <h2 className="payment-heading">Complete Payment</h2>

        <p className="payment-text">
          You will be redirected to Stripe's secure payment page.
        </p>

        <div className="payment-summary">
          <span>Total Amount:</span>
          <b>€{orderInfo && orderInfo.totalPrice}</b>
        </div>

        <button onClick={handleCheckout} className="pay-btn">
          PAY NOW
        </button>
      </div>
    </div>
  );
};

export default Payment;
