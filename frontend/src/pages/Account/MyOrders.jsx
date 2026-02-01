import React, { useEffect } from "react";
import "./Account.css";
import { useSelector, useDispatch } from "react-redux";
import { myOrders, clearErrors } from "../../features/userSlice";
import { Link } from "react-router-dom";
import { Eye, AlertCircle } from "lucide-react";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import AccountLayout from "../../components/Account/AccountLayout";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { loading, error, orders } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(myOrders());
  }, [dispatch, error]);

  // CartModel ki tarah simple image getter
  const getFirstItemImage = (order) => {
    if (!order || !order.orderItems || order.orderItems.length === 0) {
      return "";
    }
    return order.orderItems[0].image || "";
  };

  return (
    <AccountLayout>
      <h2 className="account-heading">My Orders</h2>

      {loading ? (
        <Loader />
      ) : (
        <div className="orders-container">
          {orders && orders.length > 0 ? (
            <>
              {/* DESKTOP TABLE VIEW */}
              <div className="orders-table-wrapper desktop-only">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Items</th>
                      <th>Order ID</th>
                      <th>Status</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <div className="order-list-image-cell">
                            <img
                              src={getFirstItemImage(order)}
                              alt="Product"
                              className="order-list-img"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/60x60?text=Img";
                              }}
                            />
                          </div>
                        </td>
                        <td>#{order._id.substring(0, 10)}...</td>
                        <td>
                          <span
                            className={`status-tag ${
                              order.orderStatus === "Delivered"
                                ? "green"
                                : order.orderStatus === "Shipped"
                                ? "blue"
                                : "red"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                        <td>{order.orderItems.length} Items</td>
                        <td>€{order.totalPrice}</td>
                        <td>
                          <Link
                            to={`/order/${order._id}`}
                            className="view-btn"
                          >
                            <Eye size={18} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARD VIEW */}
              <div className="orders-card-list mobile-only">
                {orders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-card-top">
                      <img
                        src={getFirstItemImage(order)}
                        alt="Product"
                        className="order-card-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/80x80?text=Img";
                        }}
                      />
                      <div className="order-card-main">
                        <div className="order-card-row">
                          <span className="order-card-label">
                            Order ID:
                          </span>
                          <span className="order-card-value">
                            #{order._id.substring(0, 10)}...
                          </span>
                        </div>
                        <div className="order-card-row">
                          <span className="order-card-label">Status:</span>
                          <span
                            className={`status-tag inline-tag ${
                              order.orderStatus === "Delivered"
                                ? "green"
                                : order.orderStatus === "Shipped"
                                ? "blue"
                                : "red"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="order-card-bottom">
                      <div className="order-card-meta">
                        <span>{order.orderItems.length} Items</span>
                        <span className="order-card-amount">
                          €{order.totalPrice}
                        </span>
                      </div>
                      <Link
                        to={`/order/${order._id}`}
                        className="order-card-btn"
                      >
                        <Eye size={16} />
                        <span>Details</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-orders">
              <AlertCircle size={50} color="#ccc" />
              <p>No Orders Found</p>
              <Link
                to="/products"
                className="acc-btn"
                style={{ display: "inline-block", width: "auto" }}
              >
                Shop Now
              </Link>
            </div>
          )}
        </div>
      )}
    </AccountLayout>
  );
};

export default MyOrders;
