// frontend/src/pages/Order/ConfirmOrder.jsx
import React from "react";
import "./ConfirmOrder.css";
import { useSelector } from "react-redux";
import CheckoutSteps from "../../components/CartModel/CheckoutSteps";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  if (!shippingInfo || cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const shippingCharges = subtotal > 200 ? 0 : 50;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + shippingCharges + tax;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const orderInfo = {
      itemsPrice: subtotal,
      shippingPrice: shippingCharges,
      taxPrice: tax,
      totalPrice,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(orderInfo));
    toast.info("Proceeding to payment...");
    navigate("/payment");
  };

  return (
    <div className="confirm-order-page">
      <CheckoutSteps activeStep={1} />

      <div className="confirm-order-container">
        <div className="confirm-shipping-area">
          <h2 className="confirm-heading">Shipping Info</h2>
          <div className="confirm-box">
            <div className="confirm-row">
              <b>Name:</b> <span>{user?.name}</span>
            </div>
            <div className="confirm-row">
              <b>Phone:</b> <span>{shippingInfo.phoneNo}</span>
            </div>
            <div className="confirm-row">
              <b>Address:</b> <span>{address}</span>
            </div>
          </div>

          <h2 className="confirm-heading">Your Cart Items</h2>
          <div className="confirm-cart-items">
            {cartItems.length === 0 ? (
              <p>Cart is Empty</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.product} className="confirm-item-card">
                  <img src={item.image} alt={item.name} />
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
                  <span>
                    {item.quantity} x €{item.price} ={" "}
                    <b>€{(item.quantity * item.price).toFixed(2)}</b>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="order-summary">
          <h2 className="summary-heading">Order Summary</h2>
          <div className="summary-box">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>€{shippingCharges.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (18%):</span>
              <span>€{tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="summary-total">
            <span>Total:</span>
            <span>€{totalPrice.toFixed(2)}</span>
          </div>

          <button onClick={proceedToPayment} className="payment-btn">
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;
