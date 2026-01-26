// frontend/src/pages/Order/Payment.jsx
import React from "react";
import CheckoutSteps from "../../components/CartModel/CheckoutSteps";
import { useSelector } from "react-redux";
import "./Payment.css";
import { toast } from "react-toastify";
import API from "../../api";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const shippingCharges = subtotal > 200 ? 0 : 50;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + shippingCharges + tax;

  const handleCheckout = async () => {
    try {
      const { data } = await API.post(
        "/api/v1/payment/create-checkout-session",
        {
          cartItems,
          shippingInfo,
          user,
          subtotal,
          shippingCharges,
          tax,
          totalPrice,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Payment URL not received");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Payment Error, please try again"
      );
    }
  };

  return (
    <div className="payment-container">
      <CheckoutSteps activeStep={2} />

      <div className="payment-box">
        <h2 className="payment-heading">Complete Payment</h2>

        <p className="payment-text">
          You will be redirected to Stripe&apos;s secure payment page.
        </p>

        <div className="payment-summary">
          <span>Total Amount:</span>
          <b>€{orderInfo?.totalPrice || totalPrice.toFixed(2)}</b>
        </div>

        <button onClick={handleCheckout} className="pay-btn">
          PAY NOW
        </button>
      </div>
    </div>
  );
};

export default Payment;
