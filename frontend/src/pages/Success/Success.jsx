// frontend/src/pages/Order/Success.jsx
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearCart } from "../../features/cartSlice";
import { CheckCircle, XCircle } from "lucide-react";
import "./Success.css";

const Success = () => {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");
  const dispatch = useDispatch();

  const [status, setStatus] = useState("processing");
  const runOnce = useRef(false);

  useEffect(() => {
    if (!session_id) {
      setStatus("failed");
      return;
    }

    if (runOnce.current) return;
    runOnce.current = true;

    const checkOrderStatus = async () => {
      try {
        // backend endpoint jo session_id se order find kare
        const { data } = await axios.get(
          `/api/v1/payment/checkout-status?session_id=${session_id}`,
          { withCredentials: true }
        );

        if (data.orderCreated) {
          setStatus("success");
          dispatch(clearCart());
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Check status failed:", error);
        setStatus("failed");
      }
    };

    checkOrderStatus();
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
          <Link to="/account/orders" className="success-btn">
            View My Orders
          </Link>
        </div>
      )}

      {status === "failed" && (
        <div className="success-content">
          <XCircle size={80} color="#e74c3c" />
          <h1>Payment Verified but Order Not Found</h1>
          <p>If money was deducted, please contact support.</p>
          <Link to="/cart" className="success-btn">
            Back to Cart
          </Link>
        </div>
      )}
    </div>
  );
};

export default Success;
