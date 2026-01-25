import React, { useEffect } from "react";
import "./OrderList.css"; // Niche CSS hai
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import Sidebar from "../../components/Admin/Sidebar";
import Loader from "../../components/Loader/Loader";
import {
  getAllOrders,
  deleteOrder,
  clearErrors,
  resetUpdate,
} from "../../features/orderSlice";

const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, orders, loading, isDeleted } = useSelector(
    (state) => state.orders
  );

  const deleteOrderHandler = (id) => {
    Swal.fire({
      title: "Delete Order?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteOrder(id));
      }
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      Swal.fire("Deleted!", "Order has been deleted.", "success");
      navigate("/admin/orders");
      dispatch(resetUpdate());
      dispatch(getAllOrders()); // Refresh list
    }

    dispatch(getAllOrders());
  }, [dispatch, error, isDeleted, navigate]);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="productListContainer">
        {" "}
        {/* Reusing Container Class */}
        <div className="productListHeader">
          <h1 id="productListHeading">All Orders</h1>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="productTableContainer">
            <table className="productTable">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Items Qty</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders &&
                  orders.map((item) => (
                    <tr key={item._id}>
                      <td style={{ fontFamily: "monospace" }}>{item._id}</td>

                      <td>
                        <span
                          className={`statusLabel ${
                            item.orderStatus === "Delivered"
                              ? "greenColor"
                              : "redColor"
                          }`}
                        >
                          {item.orderStatus}
                        </span>
                      </td>

                      <td>{item.orderItems.length}</td>

                      <td>€{item.totalPrice}</td>

                      <td>
                        <div className="actionButtons">
                          <Link to={`/admin/order/${item._id}`}>
                            <Edit size={20} color="#3498db" />
                          </Link>
                          <button onClick={() => deleteOrderHandler(item._id)}>
                            <Trash2 size={20} color="#e74c3c" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {orders && orders.length === 0 && (
              <p className="noProducts">No Orders Found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
