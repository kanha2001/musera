import React, { useEffect } from "react";
import "./Account.css"; // Same CSS use karenge
import Sidebar from "../../components/Account/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { getOrderDetails, clearErrors } from "../../features/userSlice";
import { useParams, Link } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import { MapPin, CreditCard, Package } from "lucide-react";

const OrderDetails = () => {
  const { orderDetails, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getOrderDetails(id));
  }, [dispatch, error, id]);

  return (
    <div className="account-wrapper">
      <div className="account-sidebar-area">
        <Sidebar />
      </div>

      <div className="account-main-area">
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className="account-heading" style={{ fontSize: "20px" }}>
              Order #{orderDetails && orderDetails._id}
            </h2>

            <div className="order-details-container">
              {/* Shipping Info */}
              <div className="order-section">
                <h3>
                  <MapPin size={18} /> Shipping Info
                </h3>
                <div className="section-content">
                  <p>
                    <strong>Name:</strong> {orderDetails?.user?.name}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {orderDetails?.shippingInfo?.phoneNo}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {orderDetails?.shippingInfo?.address},{" "}
                    {orderDetails?.shippingInfo?.city},{" "}
                    {orderDetails?.shippingInfo?.state} -{" "}
                    {orderDetails?.shippingInfo?.pinCode}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="order-section">
                <h3>
                  <CreditCard size={18} /> Payment
                </h3>
                <div className="section-content">
                  <p>
                    <strong>Status: </strong>
                    <span
                      className={
                        orderDetails?.paymentInfo?.status === "succeeded"
                          ? "green-text"
                          : "red-text"
                      }
                    >
                      {orderDetails?.paymentInfo?.status === "succeeded"
                        ? "PAID"
                        : "NOT PAID"}
                    </span>
                  </p>
                  <p>
                    <strong>Amount:</strong> €{orderDetails?.totalPrice}
                  </p>
                </div>
              </div>

              {/* Order Status */}
              <div className="order-section">
                <h3>
                  <Package size={18} /> Order Status
                </h3>
                <div className="section-content">
                  <p
                    className={
                      orderDetails?.orderStatus === "Delivered"
                        ? "green-text"
                        : "red-text"
                    }
                  >
                    {orderDetails?.orderStatus}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="order-section">
                <h3>Order Items</h3>
                <div className="order-items-list">
                  {orderDetails?.orderItems &&
                    orderDetails.orderItems.map((item) => (
                      <div key={item.product} className="order-item">
                        <img src={item.image} alt="Product" />
                        <div className="item-details">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                          <span>
                            {item.quantity} x €{item.price} ={" "}
                            <b>€{item.price * item.quantity}</b>
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
