import React, { useEffect, useState } from "react";
import "./ProcessOrder.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Truck, CreditCard, User, Box } from "lucide-react"; // Icons for better UI
import Sidebar from "../../components/Admin/Sidebar";
import Loader from "../../components/Loader/Loader";
import {
  getOrderDetails,
  clearErrors,
  updateOrder,
  resetUpdate,
} from "../../features/orderSlice";

const ProcessOrder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { order, error, loading } = useSelector((state) => state.orders);
  const { error: updateError, isUpdated } = useSelector(
    (state) => state.orders
  );

  const [status, setStatus] = useState("");

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();
    if (status === "") {
      toast.error("Please select a status");
      return;
    }
    const myForm = new FormData();
    myForm.set("status", status);

    dispatch(updateOrder({ id: id, status: status }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("Order Updated Successfully");
      dispatch(resetUpdate());
    }

    dispatch(getOrderDetails(id));
  }, [dispatch, error, id, isUpdated, updateError]);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="newProductContainer">
        {loading ? (
          <Loader />
        ) : (
          <div className="processOrderPage">
            <div className="confirmOrderPage">
              {" "}
              {/* Removed display grid condition to keep layout fixed */}
              {/* --- LEFT SIDE: ORDER DETAILS --- */}
              <div className="orderDetailsSection">
                {/* 1. SHIPPING INFO CARD */}
                <div className="infoCard">
                  <div className="cardHeader">
                    <Truck size={20} />
                    <h2>Shipping Info</h2>
                  </div>
                  <div className="cardBody">
                    <div className="infoRow">
                      <span className="label">Name:</span>
                      <span className="value">
                        {order.user && order.user.name}
                      </span>
                    </div>
                    <div className="infoRow">
                      <span className="label">Phone:</span>
                      <span className="value">
                        {order.shippingInfo && order.shippingInfo.phoneNo}
                      </span>
                    </div>
                    <div className="infoRow">
                      <span className="label">Address:</span>
                      <span className="value">
                        {order.shippingInfo &&
                          `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. PAYMENT INFO CARD */}
                <div className="infoCard">
                  <div className="cardHeader">
                    <CreditCard size={20} />
                    <h2>Payment Info</h2>
                  </div>
                  <div className="cardBody">
                    <div className="infoRow">
                      <span className="label">Status:</span>
                      <span
                        className={`statusBadge ${
                          order.paymentInfo &&
                          order.paymentInfo.status === "succeeded"
                            ? "successBadge"
                            : "dangerBadge"
                        }`}
                      >
                        {order.paymentInfo &&
                        order.paymentInfo.status === "succeeded"
                          ? "PAID"
                          : "NOT PAID"}
                      </span>
                    </div>
                    <div className="infoRow">
                      <span className="label">Amount:</span>
                      <span className="value amountText">
                        €{order.totalPrice && order.totalPrice}
                      </span>
                    </div>
                    {/* ADDED PAYMENT ID */}
                    <div className="infoRow">
                      <span className="label">Payment ID:</span>
                      <span
                        className="value"
                        style={{ fontFamily: "monospace" }}
                      >
                        {order.paymentInfo && order.paymentInfo.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. ORDER STATUS CARD */}
                <div className="infoCard">
                  <div className="cardHeader">
                    <Box size={20} />
                    <h2>Current Order Status</h2>
                  </div>
                  <div className="cardBody">
                    <div className="infoRow">
                      <span className="label">Status:</span>
                      <span
                        className={`statusBadge ${
                          order.orderStatus === "Delivered"
                            ? "successBadge"
                            : order.orderStatus === "Shipped"
                            ? "warningBadge"
                            : "dangerBadge"
                        }`}
                      >
                        {order.orderStatus && order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. CART ITEMS */}
                <div className="infoCard">
                  <div className="cardHeader">
                    <h2>Order Items</h2>
                  </div>
                  <div className="cartItemsList">
                    {order.orderItems &&
                      order.orderItems.map((item) => (
                        <div key={item.product} className="cartItem">
                          <img src={item.image} alt="Product" />
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>{" "}
                          <span>
                            {item.quantity} X €{item.price} ={" "}
                            <b>€{item.price * item.quantity}</b>
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              {/* --- RIGHT SIDE: PROCESS FORM (Always Visible) --- */}
              <div className="processActionSection">
                <form
                  className="updateOrderForm"
                  onSubmit={updateOrderSubmitHandler}
                >
                  <h1>Process Order</h1>
                  <p className="formSubtitle">Change order status manually</p>

                  <div className="selectGroup">
                    {/* ALL OPTIONS VISIBLE - NO RESTRICTION */}
                    <select
                      onChange={(e) => setStatus(e.target.value)}
                      value={status}
                    >
                      <option value="">Choose Status</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <button
                    id="createProductBtn"
                    type="submit"
                    disabled={loading ? true : false}
                  >
                    Update Status
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessOrder;
