import React, { useEffect } from "react";
import "./OrderDetails.css"; // <-- naya CSS yahan
import { useSelector, useDispatch } from "react-redux";
import { getOrderDetails, clearErrors } from "../../features/userSlice";
import { useParams, Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import { MapPin, CreditCard, Package, ArrowLeft } from "lucide-react";

const OrderDetails = () => {
  const { orderDetails, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getOrderDetails(id));
  }, [dispatch, error, id]);

  if (!orderDetails && !loading) {
    return (
      <div className="od-page-wrapper">
        <div className="od-main">
          <button className="od-back-btn" onClick={() => navigate("/orders")}>
            <ArrowLeft size={18} />
            <span>Back to Orders</span>
          </button>
          <p>Order not found.</p>
        </div>
      </div>
    );
  }

  const {
    _id,
    shippingInfo,
    user,
    paymentInfo,
    totalPrice,
    itemsPrice,
    taxPrice,
    shippingPrice,
    orderStatus,
    orderItems = [],
    paidAt,
  } = orderDetails || {};

  return (
    <div className="od-page-wrapper">
      <div className="od-main">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="od-header">
              <button
                className="od-back-btn"
                onClick={() => navigate("/orders")}
              >
                <ArrowLeft size={18} />
                <span>Back to Orders</span>
              </button>
              <div className="od-heading-wrap">
                <h2 className="od-title">Order Details</h2>
                <p className="od-id">Order ID: #{_id}</p>
              </div>
            </div>

            <div className="od-grid">
              {/* Shipping Info */}
              <div className="od-card">
                <h3 className="od-card-title">
                  <MapPin size={18} /> Shipping Details
                </h3>
                <div className="od-card-body">
                  <p>
                    <span className="od-label">Name:</span>{" "}
                    <span className="od-value">{user?.name}</span>
                  </p>
                  <p>
                    <span className="od-label">Phone:</span>{" "}
                    <span className="od-value">{shippingInfo?.phoneNo}</span>
                  </p>
                  <p>
                    <span className="od-label">Address:</span>{" "}
                    <span className="od-value">
                      {shippingInfo?.address}, {shippingInfo?.city},{" "}
                      {shippingInfo?.state}, {shippingInfo?.country} -{" "}
                      {shippingInfo?.pinCode}
                    </span>
                  </p>
                </div>
              </div>

              {/* Payment Info + Breakdown */}
              <div className="od-card">
                <h3 className="od-card-title">
                  <CreditCard size={18} /> Payment & Amount
                </h3>
                <div className="od-card-body">
                  <p>
                    <span className="od-label">Status:</span>{" "}
                    <span
                      className={
                        paymentInfo?.status === "succeeded"
                          ? "od-pill od-pill-green"
                          : "od-pill od-pill-red"
                      }
                    >
                      {paymentInfo?.status === "succeeded"
                        ? "PAID"
                        : "NOT PAID"}
                    </span>
                  </p>
                  <p>
                    <span className="od-label">Payment ID:</span>{" "}
                    <span className="od-value">{paymentInfo?.id}</span>
                  </p>
                  {paidAt && (
                    <p>
                      <span className="od-label">Paid At:</span>{" "}
                      <span className="od-value">
                        {new Date(paidAt).toLocaleString()}
                      </span>
                    </p>
                  )}

                  <div className="od-breakdown">
                    <div className="od-break-row">
                      <span>Items Total</span>
                      <span>€{itemsPrice}</span>
                    </div>
                    <div className="od-break-row">
                      <span>Shipping</span>
                      <span>€{shippingPrice}</span>
                    </div>
                    <div className="od-break-row">
                      <span>GST / Tax</span>
                      <span>€{taxPrice}</span>
                    </div>
                    <div className="od-break-row od-break-total">
                      <span>Grand Total</span>
                      <span>€{totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="od-card">
                <h3 className="od-card-title">
                  <Package size={18} /> Order Status
                </h3>
                <div className="od-card-body">
                  <p
                    className={
                      orderStatus === "Delivered"
                        ? "od-status od-status-delivered"
                        : orderStatus === "Shipped"
                        ? "od-status od-status-shipped"
                        : "od-status od-status-processing"
                    }
                  >
                    {orderStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="od-items-card">
              <h3 className="od-card-title">Order Items</h3>
              <div className="od-items-list">
                {orderItems.map((item) => (
                  <div key={item.product} className="od-item-row">
                    <div className="od-item-left">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="od-item-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/60x60?text=Img";
                        }}
                      />
                      <div className="od-item-info">
                        <Link
                          to={`/product/${item.product}`}
                          className="od-item-name"
                        >
                          {item.name}
                        </Link>
                        <span className="od-item-qty">
                          Qty: {item.quantity}
                        </span>
                        <span className="od-item-price-line">
                          €{item.price} x {item.quantity} ={" "}
                          <b>€{item.price * item.quantity}</b>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
