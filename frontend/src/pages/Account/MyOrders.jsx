import React, { useEffect } from "react";
import "./Account.css";
import { useSelector, useDispatch } from "react-redux";
import { myOrders, clearErrors } from "../../features/userSlice";
import { Link } from "react-router-dom";
import { Eye, AlertCircle } from "lucide-react";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import AccountLayout from "../../components/Account/AccountLayout"; // Import Layout

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

  return (
    <AccountLayout>
      <h2 className="account-heading">My Orders</h2>

      {loading ? (
        <Loader />
      ) : (
        <div className="orders-container">
          {orders && orders.length > 0 ? (
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
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
                      <td>#{order._id.substring(0, 10)}...</td>
                      <td>
                        <span
                          className={`status-tag ${
                            order.orderStatus === "Delivered" ? "green" : "red"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>{order.orderItems.length} Items</td>
                      <td>€{order.totalPrice}</td>
                      <td>
                        <Link to={`/order/${order._id}`} className="view-btn">
                          <Eye size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
